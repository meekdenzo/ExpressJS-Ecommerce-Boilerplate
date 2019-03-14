const { check } = require('express-validator/check');

module.exports = {
  valCreateProduct: [
    check('name')
      .isLength({ min: 1 })
      .withMessage('Name is a required field.'),
    check('description')
      .isLength({ min: 1 })
      .withMessage('Description is a required field.'),
    check('price')
      .isLength({ min: 1 })
      .withMessage('Price is a required field.'),
    check('category_id')
      .isLength({ min: 1 })
      .withMessage('Category is a required field.')
  ],
  valAttribute: [
    check('attribute_value_id')
      .isLength({ min: 1 })
      .withMessage('Attribute Valude is a required field.')
  ],
  valCategory: [
    check('category_id')
      .isLength({ min: 1 })
      .withMessage('Category is a required field.')
  ],
  valReview: [
    check('review')
      .isLength({ min: 1 })
      .withMessage('Review is a required field.'),
    check('rating')
      .isLength({ min: 1 })
      .withMessage('Rating is a required field.')
  ]
};
