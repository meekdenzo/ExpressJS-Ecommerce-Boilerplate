const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const Sequelize = require('sequelize');
const appRoot = require('app-root-path');
const Op = Sequelize.Op;

const asyncMiddleware = require(appRoot + '/app/helper/asyncMiddleware');
const config = require(appRoot + '/app/config/app.json');
const model = require(appRoot + '/app/database/models');
const Customer = model.customer;
const User = model.user;

const { valCreateUser, valUpdateUser, valSignin } = require(appRoot + '/app/validation/user');
const { valQuery, valParam } = require(appRoot + '/app/validation/common');
const { validationResult } = require('express-validator/check');

/*
 @route POST api/v1/users/
 @desc  Sign in user
 @access Public
*/
router.post(
  '/signin',
  valSignin,
  asyncMiddleware(async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }

    errors = [];

    let { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email: email
      },
      attributes: ['user_id', 'email', 'password']
    });

    if (!user) {
      errors.push({
        location: 'body',
        msg: 'User not exist',
        param: 'email',
        value: email
      });
      return res.status(422).json({
        errors: errors
      });
    }

    const isMatch = await user.validPassword(password);

    if (!isMatch) {
      errors.push({
        location: 'body',
        msg: 'Fails to signin',
        param: 'email',
        value: email
      });
      return res.status(422).json({
        errors: errors
      });
    }

    const payload = await {
      user_id: user.user_id,
      email: user.email
    };

    const token = await jwt.sign(payload, config.passkey, {
      expiresIn: 60 * 60
    });

    res.status(200).json({
      success: true,
      token: 'Bearer ' + token
    });
  })
);
/*
 @route GET api/v1/users/facebook/callback
 @desc  Facebook signin
 @access Public
*/
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    session: false
  }),
  asyncMiddleware(async (req, res) => {
    const user = await req.user;

    const payload = await {
      user_id: user.user_id,
      email: user.email
    };

    const token = await jwt.sign(payload, config.passkey, {
      expiresIn: 60 * 60
    });

    res.status(200).json({
      success: true,
      token: 'Bearer ' + token
    });
  })
);
/*
 @route POST api/v1/users/
 @desc  Create user
 @access Public
*/
router.post(
  '/',
  valCreateUser,
  asyncMiddleware(async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }

    errors = [];

    let { email, password, first_name, last_name } = req.body;

    const [user, created] = await User.findOrCreate({
      where: {
        email: email
      },
      attributes: ['email'],
      defaults: {
        email,
        password
      }
    });

    if (!created) {
      errors.push({
        location: 'body',
        msg: 'Email already exist',
        param: 'email',
        value: email
      });
      return res.status(422).json({
        errors: errors
      });
    }

    await user.createCustomer({ first_name, last_name });

    res.status(201).json({ message: 'SUCCESS' });
  })
);

/*
 @route POST api/v1/customers/update
 @desc  Update customer info
 @access Private
*/
router.post(
  '/update',
  valUpdateUser,
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

    const { email, password } = req.body;

    const count = await Customer.count({
      where: {
        [Op.not]: [
          {
            customer_id: req.user.customer_id
          }
        ],
        email: email
      }
    });

    if (count > 0) {
      errors.push({
        location: 'body',
        msg: 'email is already exist',
        param: 'email',
        value: email
      });
      return res.status(422).json({
        errors: errors
      });
    }

    await req.user.update({
      email,
      password
    });
    res.status(200).json({
      message: 'SUCCESS'
    });
  })
);

/*
 @route GET api/v1/users/current
 @desc  Get current user
 @access Public
*/
router.get(
  '/current',
  passport.authenticate('jwt', {
    session: false
  }),
  asyncMiddleware(async (req, res) => {
    const user = await req.user;

    res.status(200).json(user);
  })
);
/*
 @route GET api/v1/users/:id
 @desc  Get user by Id
 @access Public
*/
router.get(
  '/:id',
  valParam,
  passport.authenticate('jwt', {
    session: false
  }),
  asyncMiddleware(async (req, res) => {
    if (req.user.role != 'ADMIN') return res.status(403).json({ message: 'FORBIDDEN' });

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'NOTFOUND' });
    }

    res.status(200).json(user);
  })
);

module.exports = router;
