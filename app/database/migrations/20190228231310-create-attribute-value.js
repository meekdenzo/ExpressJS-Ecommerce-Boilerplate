
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('attribute_value', {
    attribute_value_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    attribute_id: {
      type: Sequelize.INTEGER,
    },
    value: {
      type: Sequelize.STRING,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('attribute_value'),
};
