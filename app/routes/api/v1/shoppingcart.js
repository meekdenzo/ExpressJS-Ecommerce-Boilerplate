const express = require('express');
const router = express.Router();
const appRoot = require('app-root-path');
const passport = require('passport');
const request = require('request-promise');
const { promisify } = require('util');
const redis = require('redis');
const client = redis.createClient();
const gethAsync = promisify(client.hgetall).bind(client);

const { PAYPAL_CONFIG } = require(appRoot + '/app/config/app.json');
const asyncMiddleware = require(appRoot + '/app/helper/asyncMiddleware');
const model = require(appRoot + '/app/database/models');

const ShoppingCart = model.shopping_cart;
const Order = model.orders;
const Product = model.product;
const Shipping = model.shipping;
const Tax = model.tax;
const OrderDetail = model.order_detail;

const { valAddCart } = require(appRoot + '/app/validation/shoppingcart');
const { validationResult } = require('express-validator/check');
const { valQuery, valParam } = require(appRoot + '/app/validation/common');
const PAYPAL_API = 'https://api.sandbox.paypal.com';

// Adjust the product object
const shoppingProduct = async carts => {
  let total = 0;
  let products = [];

  Object.keys(carts).forEach(key => {
    const cart = carts[key];

    const p = cart.product;
    // Check the price
    const price = p.discounted_price == 0 ? p.price : p.discounted_price;
    const total_amount = price * cart.quantity;

    total += total_amount;
    p.total_amount = total_amount;

    products.push(cart);
  });

  // Add total product price at the first of array
  await products.unshift(total);

  return [products, total];
};
/*
 @access    Public
 @route     POST api/v1/carts
 @desc      Add product to cart
*/
router.post(
  '/',
  valAddCart,
  asyncMiddleware(async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { attribute, cart_id, product_id } = req.body;

    const [product, created] = await ShoppingCart.findOrCreate({
      attributes: ['quantity', 'item_id', 'attribute'],
      where: {
        cart_id,
        product_id,
        attribute
      },
      defaults: {
        cart_id,
        product_id,
        attribute,
        added_on: new Date(),
        quantity: 1
      },
      include: [{ model: Product, attributes: ['product_id', 'name', 'price', 'discounted_price'] }]
    });

    if (!created) {
      await product.increment(['quantity'], { by: 1 });
      await product.update({ buy_now: true });
    } else {
      //Reload the model to include the relationship
      await product.reload();
    }

    // Add to redis database
    client.hset(`carts:products:${cart_id}`, product_id, JSON.stringify(product));

    res.status(200).json({ message: 'SUCCESS' });
  })
);
/*
 @access    Public
 @route     POST api/v1/carts/checkout
 @desc      Create cart order
*/
const createOrder = async (tax_id, cart_id, shipping_id, customer_id) => {
  const carts = await ShoppingCart.findAll({
    where: { cart_id, buy_now: true },
    attributes: ['attribute', 'quantity'],
    include: [{ model: Product, attributes: ['product_id', 'name', 'price', 'discounted_price'] }]
  });

  if (carts.length == 0) {
    return false;
  } else {
    const order = await Order.create({
      tax_id,
      shipping_id,
      customer_id: customer_id,
      created_on: new Date()
    });

    let orders = [];
    let total = 0;
    const orderDetail = {};

    for await (const cart of carts) {
      const product = cart.product;
      const price = product.discounted_price === 0 ? product.price : product.discounted_price;
      const total_amount = cart.quantity * price;
      total += total_amount;

      orderDetail.order_id = order.order_id;
      orderDetail.product_id = product.product_id;
      orderDetail.attributes = cart.attribute;
      orderDetail.product_name = product.name;
      orderDetail.quantity = cart.quantity;
      orderDetail.unit_cost = price;

      orders.push(orderDetail);
      order.update({ total_amount: total_amount });
    }

    carts.forEach(cart => {
      cart.destroy();
    });

    await OrderDetail.bulkCreate(orders);

    return true;
  }
};
/*
 @access    Private
 @route     POST api/v1/carts/create-payment/:id
 @desc      Create Paypal payment
*/
router.post(
  '/create-payment/',
  passport.authenticate('jwt', {
    session: false
  }),
  asyncMiddleware(async (req, res) => {
    const { tax_id, cart_id, shipping_id } = req.body;

    const carts = await gethAsync(`carts:products:${cart_id}`);
    let cartProducts = [];

    if (!carts) {
      const carts = await ShoppingCart.findAll({
        where: { cart_id: cart_id, buy_now: false },
        attributes: ['item_id', 'attribute', 'quantity'],
        include: [
          {
            model: Product,
            attributes: ['product_id', 'name', 'description', 'price', 'discounted_price']
          }
        ]
      });

      if (!carts) {
        return res.status(400).json({ message: 'NOTFOUND' });
      }

      cartProducts = carts;
    } else {
      Object.keys(carts).forEach(async key => {
        await cartProducts.push(JSON.parse(carts[key]));
      });
    }

    const [products, total] = await shoppingProduct(cartProducts);

    const shipping = await Shipping.findOne({ where: { shipping_id: shipping_id } });
    const tax = await Tax.find({ where: { tax_id: tax_id } });

    const floatTax = (await (tax.tax_percentage * total)) / 100;
    const paypalTax = Math.round(floatTax * 100) / 100;
    const paypalTotal = total + shipping.shipping_cost + paypalTax;

    const paypalProduct = [];

    for (const p of cartProducts) {
      let obj = {};
      const product = await p.product;
      const price = product.discounted_price == 0 ? product.price : product.discounted_price;

      obj.name = product.name;
      obj.description = product.description;
      obj.quantity = p.quantity;
      obj.price = price;
      obj.currency = 'USD';
      paypalProduct.push(obj);
    }

    const customer = await req.user.getCustomer({
      attributes: ['customer_id', 'first_name', 'last_name']
    });
    const address = await customer.getAddresses({ where: { primary_address: true }, limit: 1 });

    const paypalAddress =
      address != null
        ? {
            recipient_name: customer.getName(),
            line1: address[0].address_1,
            city: address[0].city,
            country_code: address[0].country,
            postal_code: address[0].postal_code,
            state: address[0].region,
            phone: address[0].mob_phone
          }
        : null;

    const paypalRes = await request.post(PAYPAL_API + '/v1/payments/payment', {
      auth: {
        user: PAYPAL_CONFIG.client_id,
        pass: PAYPAL_CONFIG.client_secret
      },
      body: {
        intent: 'sale',
        payer: {
          payment_method: 'paypal'
        },
        transactions: [
          {
            amount: {
              total: paypalTotal,
              currency: 'USD',
              details: {
                subtotal: total,
                tax: paypalTax,
                shipping: shipping.shipping_cost
              }
            },
            item_list: {
              items: paypalProduct,
              shipping_address: paypalAddress
            }
          }
        ],
        redirect_urls: {
          return_url: PAYPAL_CONFIG.return_url,
          cancel_url: PAYPAL_CONFIG.cancel_url
        }
      },
      json: true
    });
    res.status(200).json(paypalRes);
  })
);
/*
 @access    Private
 @route     POST api/v1/carts/execute-payment/
 @desc      Execute Paypal payment
*/
router.post(
  '/execute-payment',
  passport.authenticate('jwt', {
    session: false
  }),
  valParam,
  asyncMiddleware(async (req, res) => {
    const customer = await req.user.getCustomer();

    const { tax_id, cart_id, shipping_id, paymentID, payerID } = req.body;

    const paypal = await request.post(
      PAYPAL_API + '/v1/payments/payment/' + paymentID + '/execute',
      {
        auth: {
          user: PAYPAL_CONFIG.client_id,
          pass: PAYPAL_CONFIG.client_secret
        },
        body: {
          payer_id: payerID
        },
        json: true
      }
    );

    if (!paypal) {
      res.status(500).json({ message: 'SYSERROR' });
    }

    await createOrder(tax_id, cart_id, shipping_id, customer.customer_id);

    res.status(200).json({ message: 'success' });
  })
);
/*
 @access    Public
 @route     GET api/v1/carts/:id/products
 @desc      Get product in cart
*/
router.get(
  '/:id/products',
  valParam,
  asyncMiddleware(async (req, res) => {
    const { id } = req.params;

    client.hgetall(`carts:products:${id}`, async (err, rep) => {
      if (!rep) {
        const carts = await ShoppingCart.findAll({
          where: { cart_id: id, buy_now: false },
          attributes: ['item_id', 'attribute', 'quantity'],
          include: [
            {
              model: Product,
              attributes: ['product_id', 'name', 'description', 'price', 'discounted_price']
            }
          ]
        });

        if (!carts) return res.status(400).json({ message: 'NOTFOUND' });

        const [products, total] = await shoppingProduct(carts);
        carts.forEach(async cart => {
          const product_id = await cart.product.product_id;
          await client.hset(`carts:products:${req.params.id}`, product_id, JSON.stringify(cart));
        });

        res.status(200).json(products);
      } else {
        let arr = [];

        Object.keys(rep).forEach(async key => {
          await arr.push(JSON.parse(rep[key]));
        });

        const [products, total] = await shoppingProduct(arr);
        res.status(200).json(products);
      }
    });
  })
);
/*
 @access    Public
 @route     GET api/v1/carts/:cartId/saved
 @desc      Get saved product in cart
*/
router.get(
  '/:id/saved',
  passport.authenticate('jwt', {
    session: false
  }),
  valParam,
  asyncMiddleware(async (req, res) => {
    client.hget('carts:saved', req.params.id, async (err, rep) => {
      if (!rep) {
        const carts = await ShoppingCart.findAll({
          where: { cart_id: req.params.id, buy_now: false },
          attributes: ['item_id', 'attribute', 'quantity'],
          include: [{ model: Product, attributes: ['name', 'price', 'discounted_price'] }]
        });

        if (!carts) {
          return res.status(400).json({ message: 'NOTFOUND' });
        }

        client.hset('carts:saved', req.params.id, JSON.stringify(carts));
        res.status(200).json(carts);
      } else {
        res.status(200).json(JSON.parse(rep));
      }
    });
  })
);
/*
 @access    Public
 @route     GET api/v1/carts/:id/amount
 @desc      Get saved product amount
*/
router.get(
  '/:id/amount',
  asyncMiddleware(async (req, res) => {
    client.hgetall(`carts:products:${req.params.id}`, async (err, data) => {
      if (!res) {
        const carts = await ShoppingCart.findAll({
          where: { cart_id: req.params.id },
          attributes: ['item_id', 'attribute', 'quantity']
        });

        if (!carts) {
          return res.status(400).json({ message: 'NOTFOUND' });
        }

        const [product, total] = await shoppingProduct(carts);
        res.status(400).json(total);
      } else {
        let arr = [];

        Object.keys(data).forEach(async key => {
          await arr.push(JSON.parse(data[key]));
        });

        const [products, total] = await shoppingProduct(arr);
        res.status(200).json(total);
      }
    });
  })
);
/*
 @access    Public
 @route     DELETE api/v1/carts/:id
 @desc      Delete cart
*/
router.delete(
  '/:id',
  valParam,
  asyncMiddleware(async (req, res) => {
    const cart = await ShoppingCart.destroy({ where: { item_id: req.params.id } });
    if (!cart) {
      return res.status(400).json({ message: 'NOTFOUND' });
    }
    res.status(200).json({ message: 'SUCCESS' });
  })
);

module.exports = router;
