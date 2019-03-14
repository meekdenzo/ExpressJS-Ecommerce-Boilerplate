module.exports = (sequelize, DataTypes) => {
  const shippingregion = sequelize.define(
    'shipping_region',
    {
      shipping_region_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      shipping_region: DataTypes.STRING
    },
    {}
  );
  shippingregion.associate = models => {
    // associations can be defined here
    shippingregion.hasOne(models.shipping, { foreignKey: 'shipping_region_id' });
  };
  return shippingregion;
};
