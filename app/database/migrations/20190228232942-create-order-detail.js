
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('order_detail', {
    item_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    order_id: {
      type: Sequelize.INTEGER,
    },
    product_id: {
      type: Sequelize.INTEGER,
    },
    attribute: {
      type: Sequelize.STRING,
    },
    product_name: {
      type: Sequelize.STRING,
    },
    quantity: {
      type: Sequelize.STRING,
    },
    unit_cost: {
      type: Sequelize.DOUBLE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('order_detail'),
};
