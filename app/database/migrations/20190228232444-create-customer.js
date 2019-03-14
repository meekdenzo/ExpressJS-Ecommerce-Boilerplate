
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('customer', {
    customer_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    credit_card: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('customer'),
};
