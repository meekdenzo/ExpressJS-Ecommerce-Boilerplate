const { check, param } = require('express-validator/check');

module.exports = {
  valCreateUser: [
    check('email')
      .isEmail()
      .withMessage('Email is invalid')
      .normalizeEmail(),
    check('first_name')
      .isLength({
        min: 2
      })
      .withMessage('First Name is invalid'),
    check('last_name')
      .isLength({
        min: 2
      })
      .withMessage('Last Name is invalid'),
    check('password')
      .isLength({
        min: 8
      })
      .withMessage('Password must be at least 8 characters in length.')
      .custom((value, { req }) => value === req.body.password_confirmation)
      .withMessage("Passwords don't match.")
  ],
  valUpdateUser: [
    check('email')
      .optional({})
      .isEmail()
      .withMessage('Email is invalid')
      .normalizeEmail(),
    check('password')
      .optional()
      .isLength({
        min: 8
      })
      .withMessage('Password must be at least 8 characters in length.')
      .custom((value, { req }) => value === req.body.password_confirmation)
      .withMessage("Passwords don't match.")
  ],
  valSignin: [
    check('email')
      .isEmail()
      .withMessage('Email is invalid')
      .normalizeEmail(),
    check('password')
      .isLength({
        min: 8
      })
      .withMessage('Password must be at least 8 characters in length.')
  ]
};
