
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('attribute', {
    attribute_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('attribute'),
};
