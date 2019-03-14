
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('product_attribute', {
    attribute_value_id: {
      type: Sequelize.INTEGER,
    },
    product_id: {
      type: Sequelize.INTEGER,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('product_attribute'),
};
