const { check } = require('express-validator/check');

module.exports = {
  valAddCart: [
    check('cart_id')
      .isLength({ min: 1 })
      .withMessage('Cart Id is a required field.'),
    check('product_id')
      .isLength({ min: 1 })
      .withMessage('Product is a required field.'),
    check('attribute')
      .isLength({ min: 1 })
      .withMessage('Attributes is a required field.')
  ],
  valCreateCart: [
    check('shipping_id')
      .isLength({ min: 1 })
      .withMessage('Shipping is a required field.'),
    check('tax_id')
      .isLength({ min: 1 })
      .withMessage('Tax Id is a required field.'),
    check('cart_id')
      .isLength({ min: 1 })
      .withMessage('Cart Id is a required field.')
  ]
};
