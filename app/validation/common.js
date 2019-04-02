const { check, param, query } = require('express-validator/check');

module.exports = {
  valParam: [
    param('id')
      .toInt()
      .isInt({ gt: 0 })
      .withMessage('Invalid parameter provided')
  ],
  valQuery: [
    query('limit')
      .optional()
      .toInt()
      .isInt({ gt: 0 })
      .withMessage('Invalid query provided'),
    query('offset')
      .optional()
      .toInt()
      .isInt({ gt: 0 })
      .withMessage('Invalid query provided')
  ],
  valSearch: [
    query('str')
      .optional()
      .toString()
      .withMessage('Invalid query provided')
  ]
};
