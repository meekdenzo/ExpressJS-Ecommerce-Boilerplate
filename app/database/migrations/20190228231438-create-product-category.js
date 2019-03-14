
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('product_category', {
    product_id: {
      type: Sequelize.INTEGER,
    },
    category_id: {
      type: Sequelize.INTEGER,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('product_category'),
};
