
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('category', {
    category_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    department_id: {
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('category'),
};
