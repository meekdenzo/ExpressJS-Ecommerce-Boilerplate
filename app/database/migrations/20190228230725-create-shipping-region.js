module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('shipping_region', {
      shipping_region_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      shipping_region: {
        type: Sequelize.STRING
      }
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('shipping_region')
};
