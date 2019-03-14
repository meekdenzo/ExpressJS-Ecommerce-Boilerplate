
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('tax', {
    tax_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    tax_type: {
      type: Sequelize.STRING,
    },
    tax_percentage: {
      type: Sequelize.DOUBLE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('tax'),
};
