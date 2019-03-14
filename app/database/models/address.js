module.exports = (sequelize, DataTypes) => {
  const address = sequelize.define(
    'address',
    {
      address_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      address_1: DataTypes.TEXT,
      address_2: DataTypes.TEXT,
      city: DataTypes.STRING,
      region: DataTypes.STRING,
      postal_code: DataTypes.STRING,
      country: DataTypes.STRING,
      customer_id: DataTypes.INTEGER,
      day_phone: DataTypes.STRING,
      eve_phone: DataTypes.STRING,
      mob_phone: DataTypes.STRING,
      primary_address: DataTypes.INTEGER,
      shipping_region_id: DataTypes.INTEGER,
    },
    {},
  );
  address.associate = (models) => {
    // associations can be defined here
    address.belongsTo(models.shipping_region, {
      as: 'ShippingRegion',
      foreignKey: 'shipping_region_id',
    });
    address.belongsTo(models.customer, { foreignKey: 'customer_id' });
  };
  return address;
};
