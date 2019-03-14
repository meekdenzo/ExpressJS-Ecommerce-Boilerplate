const { check } = require('express-validator/check');

module.exports = {
  valAuth: [
    check('reference')
      .isLength({ min: 1 })
      .withMessage('Reference is a required field.'),
    check('auth_code')
      .isLength({ min: 1 })
      .withMessage('Auth code is a required field.')
  ],
  valAudit: [
    check('message')
      .isLength({ min: 1 })
      .withMessage('Message is a required field.'),
    check('code')
      .isLength({ min: 1 })
      .withMessage('Code is a required field.')
  ],
  valUpdate: [
    check('status')
      .optional()
      .escape()
      .isLength({ min: 2 })
      .withMessage('Status is a required field.'),
    check('comments')
      .optional()
      .escape()
      .isLength({ min: 5 })
      .withMessage('Comment is a required field.'),
    check('auth_code')
      .optional()
      .escape()
      .isLength({ min: 5 })
      .withMessage('Auth code is a required field.'),
    check('reference')
      .optional()
      .escape()
      .isLength({ min: 5 })
      .withMessage('Reference is a required field.'),
    check('message')
      .optional()
      .escape()
      .isLength({ min: 5 })
      .withMessage('Message is a required field.'),
    check('code')
      .optional()
      .escape()
      .isLength({ min: 5 })
      .withMessage('Code is a required field.')
  ]
};
