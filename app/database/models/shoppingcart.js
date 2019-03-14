module.exports = (sequelize, DataTypes) => {
  const shoppingcart = sequelize.define(
    'shopping_cart',
    {
      item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      cart_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      attribute: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      buy_now: DataTypes.BOOLEAN,
      added_on: DataTypes.DATE
    },
    {}
  );
  shoppingcart.associate = models => {
    // associations can be defined here
    shoppingcart.belongsTo(models.product, { foreignKey: 'product_id' });
    shoppingcart.hasMany(models.product, { foreignKey: 'product_id' });
  };
  return shoppingcart;
};
