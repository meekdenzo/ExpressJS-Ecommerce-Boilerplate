const { check, param, query } = require('express-validator/check');

module.exports = {
  valCreateCategory: [
    check('name')
      .isLength({ min: 1 })
      .withMessage('Name is a required field.')
      .escape(),
    check('description')
      .isLength({ min: 1 })
      .withMessage('Description is a required field.')
      .escape(),
    check('department_id')
      .isLength({ min: 1 })
      .withMessage('Department is a required field.')
      .toInt()
  ],
  valUpdateCategory: [
    check('name')
      .isLength({ min: 1 })
      .withMessage('Name is a required field.')
      .escape(),
    check('description')
      .isLength({ min: 1 })
      .withMessage('Description is a required field.')
      .escape()
  ]
};
