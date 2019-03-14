module.exports = (sequelize, DataTypes) => {
  const orderdetail = sequelize.define(
    'order_detail',
    {
      item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      attribute: DataTypes.STRING,
      product_name: DataTypes.STRING,
      quantity: DataTypes.STRING,
      unit_cost: DataTypes.DOUBLE,
    },
    {},
  );
  orderdetail.associate = function (models) {
    // associations can be defined here
    orderdetail.belongsTo(models.orders, { foreignKey: 'order_id' });
    orderdetail.belongsTo(models.product, { foreignKey: 'product_id' });
  };
  return orderdetail;
};
