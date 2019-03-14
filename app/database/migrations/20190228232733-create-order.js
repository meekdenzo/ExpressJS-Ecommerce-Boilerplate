
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('orders', {
    order_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    total_amount: {
      type: Sequelize.DOUBLE,
      defaultValue: '0.00',
    },
    shipped_on: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    comments: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    customer_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    auth_code: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    reference: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    shipping_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    tax_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    created_on: {
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('orders'),
};
