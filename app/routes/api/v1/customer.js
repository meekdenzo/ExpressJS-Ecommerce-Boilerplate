const express = require('express');
const router = express.Router();
const passport = require('passport');
const appRoot = require('app-root-path');

const asyncMiddleware = require(appRoot + '/app/helper/asyncMiddleware');
const model = require(appRoot + '/app/database/models');
const Customer = model.customer;
const Address = model.address;

const { valUpdateAccount, valAddress } = require(appRoot + '/app/validation/customer');
const { valQuery, valParam } = require(appRoot + '/app/validation/common');
const { validationResult } = require('express-validator/check');

/*
 @access Private
 @route POST api/v1/customers/update
 @desc  Update customer info
*/
router.post(
  '/update',
  valUpdateAccount,
  passport.authenticate('jwt', {
    session: false
  }),
  asyncMiddleware(async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }

    errors = [];

    const { first_name, last_name, shipping_region_id, credit_card } = req.body;

    const customer = await req.user.getCustomer();

    // Only Customer
    if (!customer) {
      return res.status(403).json({ message: 'FORBIDDEN' });
    }

    await Customer.update(
      {
        first_name,
        last_name,
        shipping_region_id,
        credit_card
      },
      {
        where: {
          customer_id: customer.customer_id
        }
      }
    );
    res.status(200).json({
      message: 'SUCCESS'
    });
  })
);
/*
 @route POST api/v1/customers/address
 @desc  Update customer address info
 @access Private
*/
router.post(
  '/address',
  valAddress,
  passport.authenticate('jwt', {
    session: false
  }),
  asyncMiddleware(async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }

    errors = [];

    const {
      eve_phone,
      day_phone,
      mob_phone,
      address_1,
      address_2,
      city,
      region,
      postal_code,
      shipping_region_id
    } = req.body;

    const customer = await req.user.getCustomer();

    // Only customer
    if (!customer) {
      return res.status(403).json({ message: 'FORBIDDEN' });
    }

    const address = await Address.create({
      eve_phone,
      day_phone,
      mob_phone,
      address_1,
      address_2,
      city,
      region,
      postal_code,
      shipping_region_id
    });

    customer.setAddresses([address]);

    res.status(200).json({
      message: 'SUCCESS'
    });
  })
);
/*
 @route GET api/v1/customers/:id
 @desc  Get customer
 @access Public
*/
router.get(
  '/:id',
  valParam,
  passport.authenticate('jwt', {
    session: false
  }),
  asyncMiddleware(async (req, res) => {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'NOTFOUND' });
    }

    res.status(200).json(customer);
  })
);
/*
 @route GET api/v1/customers
 @desc  Get customers
 @access Public
*/
router.get(
  '/',
  passport.authenticate('jwt', {
    session: false
  }),
  valQuery,
  asyncMiddleware(async (req, res) => {
    // Only Admin Allowed
    if (req.user.role != 'ADMIN') return res.status(403).json({ message: 'FORBIDDEN' });

    const customers = await Customer.findAll({
      attributes: ['customer_id', 'name'],
      limit: req.query.limit,
      offset: req.query.offset
    });
    res.status(200).json(customers);
  })
);

/*
 @route GET api/v1/customers/shipping-regions
 @desc  Get customers shipping-regions
 @access Public
*/
router.get(
  '/shipping/regions',
  passport.authenticate('jwt', {
    session: false
  }),
  asyncMiddleware(async (req, res) => {
    const customer = await req.user.getCustomer();
    const shpping = await customer.getShippingRegion();

    res.status(200).json(shpping);
  })
);

module.exports = router;
