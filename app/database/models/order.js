module.exports = (sequelize, DataTypes) => {
  const order = sequelize.define(
    'orders',
    {
      order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      total_amount: DataTypes.DOUBLE,
      shipped_on: DataTypes.DATE,
      status: DataTypes.BOOLEAN,
      comments: DataTypes.TEXT,
      customer_id: DataTypes.INTEGER,
      auth_code: DataTypes.STRING,
      reference: DataTypes.STRING,
      shipping_id: DataTypes.INTEGER,
      tax_id: DataTypes.INTEGER,
    },
    {},
  );
  order.associate = function (models) {
    // associations can be defined here
    order.hasMany(models.audit, { foreignKey: 'audit_id' });
    order.belongsTo(models.customer, { foreignKey: 'customer_id' });
    order.belongsTo(models.shipping, { foreignKey: 'shipping_id' });
    order.belongsTo(models.tax, { foreignKey: 'tax_id' });
  };
  return order;
};
