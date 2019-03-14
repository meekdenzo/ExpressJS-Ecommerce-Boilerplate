
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('department', {
    department_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('department'),
};
