const { check, param } = require('express-validator/check');

module.exports = {
  valUpdateAccount: [
    check('first_name')
      .optional({})
      .escape()
      .isLength({
        min: 4
      })
      .withMessage('First name is invalid'),
    check('first_name')
      .optional({})
      .escape()
      .isLength({
        min: 4
      })
      .withMessage('Last name is invalid'),

    check('credit_card')
      .optional()
      .isCreditCard()
      .withMessage('Please Enter A Vaild Credit Card Number')
  ],
  valAddress: [
    check('eve_phone')
      .optional()
      .escape()
      .isLength({
        min: 9
      })
      .withMessage('Evening Phone is invalid'),
    check('day_phone')
      .optional()
      .escape()
      .isLength({
        min: 9
      })
      .withMessage('Day Phone is invalid'),
    check('mob_phone')
      .escape()
      .isLength({
        min: 9
      })
      .withMessage('Mobile Phone is invalid'),
    check('address_1')
      .escape()
      .isLength({
        min: 5
      })
      .withMessage('Address field is invalid.'),
    check('address_2')
      .optional()
      .escape()
      .isLength({
        min: 5
      })
      .withMessage('Address 2 field is invalid.'),
    check('city')
      .escape()
      .isLength({
        min: 5
      })
      .withMessage('City field is invalid.'),
    check('region')
      .escape()
      .isLength({
        min: 5
      })
      .withMessage('Region field is invalid.'),
    check('postal_code')
      .escape()
      .isLength({
        min: 4
      })
      .withMessage('Postal Code field is invalid.'),
    check('shipping_region_id')
      .toInt()
      .isInt({ gt: 0 })
      .withMessage('Invalid Shipping Region Id provided.')
  ]
};
