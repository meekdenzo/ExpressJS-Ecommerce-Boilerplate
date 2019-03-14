
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('shopping_cart', {
    item_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    cart_id: {
      type: Sequelize.INTEGER,
    },
    product_id: {
      type: Sequelize.INTEGER,
    },
    attribute: {
      type: Sequelize.STRING,
    },
    quantity: {
      type: Sequelize.INTEGER,
    },
    buy_now: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    added_on: {
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('shopping_cart'),
};
