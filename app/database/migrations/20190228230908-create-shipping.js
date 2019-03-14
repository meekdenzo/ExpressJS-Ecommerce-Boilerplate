
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('shipping', {
    shipping_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    shipping_type: {
      type: Sequelize.STRING,
    },
    shipping_cost: {
      type: Sequelize.DOUBLE,
    },
    shipping_region_id: {
      type: Sequelize.INTEGER,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('shipping'),
};
