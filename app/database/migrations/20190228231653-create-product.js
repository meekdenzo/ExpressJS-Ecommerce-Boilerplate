
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('product', {
    product_id: {
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
    price: {
      type: Sequelize.DOUBLE,
    },
    discounted_price: {
      type: Sequelize.DOUBLE,
      defaultValue: '0.00',
    },
    image: {
      type: Sequelize.STRING,
    },
    image_2: {
      type: Sequelize.STRING,
    },
    thumbnail: {
      type: Sequelize.STRING,
    },
    display: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('product'),
};
