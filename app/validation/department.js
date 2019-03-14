const { check } = require('express-validator/check');

module.exports = {
  valCreateDepartment: [
    check('name')
      .isLength({ min: 2 })
      .escape()
      .withMessage('Name is a required field.'),
    check('description')
      .isLength({ min: 2 })
      .escape()
      .withMessage('Description is a required field.')
  ],
  valUpdateDepartment: [
    check('name')
      .optional()
      .isLength({ min: 2 })
      .withMessage('Name is a required field.')
      .escape(),
    check('description')
      .optional()
      .isLength({ min: 2 })
      .withMessage('Description is a required field.')
      .escape()
  ]
};
