const express = require('express');
const router = express.Router();
const appRoot = require('app-root-path');
const passport = require('passport');

const asyncMiddleware = require(appRoot + '/app/helper/asyncMiddleware');
const model = require(appRoot + '/app/database/models');

const Order = model.orders;
const Tax = model.tax;
const Shipping = model.shipping;
const Orderdetail = model.order_detail;

const { valQuery, valParam } = require(appRoot + '/app/validation/common');
const { valUpdate } = require(appRoot + '/app/validation/order');
const { validationResult } = require('express-validator/check');

/*  
 @access    Private
 @route     POST api/v1/orders/:id
 @desc      Update order
*/
router.post(
  '/:id',
  passport.authenticate('jwt', {
    session: false
  }),
  valParam,
  valUpdate,
  asyncMiddleware(async (req, res) => {
    // Only Admin Allowed
    if (req.user.role != 'ADMIN') return res.status(403).json({ message: 'FORBIDDEN' });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { status, comments, auth_code, reference, message, code } = req.body;

    const order = await Order.findByPk(req.params.id, { attributes: ['order_id'] });

    if (!order) {
      return res.status(422).json({
        message: 'NOTFOUND'
      });
    }

    await order.update({ status, comments, auth_code, reference, message, code });
    res.status(201).json({ message: 'SUCCESS' });
  })
);
/*
 @access    Private
 @route     POST api/v1/orders/:id/shipped
 @desc      Update order shipped
*/
router.post(
  '/:id/shipped',
  passport.authenticate('jwt', {
    session: false
  }),
  valParam,
  asyncMiddleware(async (req, res) => {
    // Only Admin Allowed
    if (req.user.role != 'ADMIN') return res.status(403).json({ message: 'FORBIDDEN' });

    const order = await Order.findByPk(req.params.id, { attribute: ['order_id'] });

    if (!order) {
      return res.status(422).json({
        message: 'NOTFOUND'
      });
    }

    await order.update({ shipped_on: new Date() });
    res.status(200).json({ message: 'SUCCESS' });
  })
);
/*
 @access    Private
 @route     GET api/v1/orders/:id
 @desc      Get order info
*/
router.get(
  '/:id',
  passport.authenticate('jwt', {
    session: false
  }),
  valParam,
  asyncMiddleware(async (req, res) => {
    // Only Admin Allowed
    if (req.user.role != 'ADMIN') return res.status(403).json({ message: 'FORBIDDEN' });

    const order = await Order.findByPk(req.params.id, {
      attribute: [
        'order_id',
        'total_amount',
        'created_on',
        'shipped_on',
        'status',
        'comments',
        'customer_id'
      ],
      include: [
        {
          model: Shipping,
          attribute: ['shipping_id', 'shipping_type', 'shipping_cost']
        },
        {
          model: Tax,
          attribute: ['tax_id', 'tax_type', 'tax_percentage']
        }
      ]
    });

    if (!order) {
      return res.status(422).json({
        message: 'NOTFOUND'
      });
    }
    res.status(200).json(order);
  })
);
/*
 @access    Private
 @route     GET api/v1/orders/:id/details
 @desc      Get order details info
*/
router.get(
  '/:id/details',
  passport.authenticate('jwt', {
    session: false
  }),
  valParam,
  asyncMiddleware(async (req, res) => {
    const orderDetail = await Orderdetail.findOne({
      where: { order_id: req.params.id },
      attributes: ['attribute', 'product_name', 'quantity', 'unit_cost', 'order_id', 'product_id']
    });

    if (!orderDetail) {
      return res.status(422).json({
        message: 'NOTFOUND'
      });
    }
    res.status(200).json(orderDetail);
  })
);
/*
 @access    Private
 @route     GET api/v1/orders/customer/:id
 @desc      Get orders by customer
*/
router.get(
  '/customer/:id/',
  passport.authenticate('jwt', {
    session: false
  }),
  valParam,
  valQuery,
  asyncMiddleware(async (req, res) => {
    const customer = await req.user.getCustomer({ attributes: ['customer_id'] });

    if (!customer) {
      return res.status(422).json({
        message: 'NOTFOUND'
      });
    }

    const customerOrder = await customer.getOrders({
      attributes: ['order_id', 'total_amount', 'created_on', 'status'],
      limit: req.query.limit,
      offset: req.query.offset
    });
    res.status(200).json(customerOrder);
  })
);
module.exports = router;
