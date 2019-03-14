module.exports = (sequelize, DataTypes) => {
  const shipping = sequelize.define(
    'shipping',
    {
      shipping_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      shipping_type: DataTypes.STRING,
      shipping_cost: DataTypes.DOUBLE,
      shipping_region_id: DataTypes.INTEGER,
    },
    {},
  );
  shipping.associate = () => {
    // associations can be defined here
  };
  return shipping;
};
