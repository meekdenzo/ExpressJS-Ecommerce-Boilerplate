
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('review', {
    review_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    customer_id: {
      type: Sequelize.INTEGER,
    },
    product_id: {
      type: Sequelize.INTEGER,
    },
    review: {
      type: Sequelize.TEXT,
    },
    rating: {
      type: Sequelize.INTEGER,
    },
    created_on: {
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('review'),
};
