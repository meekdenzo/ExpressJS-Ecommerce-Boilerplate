
module.exports = (sequelize, DataTypes) => {
  const review = sequelize.define('review', {
    review_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    review: DataTypes.TEXT,
    rating: DataTypes.INTEGER,
    created_on: DataTypes.DATE,
  }, {});
  review.associate = function (models) {
    // associations can be defined here
    review.belongsTo(models.customer, { foreignKey: 'customer_id' });
    review.belongsTo(models.product, { foreignKey: 'product_id' });
  };
  return review;
};
