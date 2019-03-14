
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('audit', {
    audit_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    order_id: {
      type: Sequelize.INTEGER,
    },
    message: {
      type: Sequelize.STRING,
    },
    code: {
      type: Sequelize.INTEGER,
    },
    created_on: {
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('audit'),
};
