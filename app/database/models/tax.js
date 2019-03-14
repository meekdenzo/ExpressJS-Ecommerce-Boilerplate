module.exports = (sequelize, DataTypes) => {
  const tax = sequelize.define(
    'tax',
    {
      tax_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tax_type: DataTypes.STRING,
      tax_percentage: DataTypes.DOUBLE,
    },
    {},
  );
  tax.associate = () => {
    // associations can be defined here
  };
  return tax;
};
