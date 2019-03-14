
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('address', {
    address_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    address_1: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    address_2: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    region: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    postal_code: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    country: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    customer_id: {
      type: Sequelize.INTEGER,
    },
    day_phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    eve_phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    mob_phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    primary_address: {
      type: Sequelize.INTEGER,
      defaultValue: false,
    },
    shipping_region_id: {
      type: Sequelize.INTEGER,
      defaultValue: '1',
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('address'),
};
