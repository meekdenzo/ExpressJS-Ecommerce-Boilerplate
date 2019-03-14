module.exports = (sequelize, DataTypes) => {
  const attributevalue = sequelize.define(
    'attribute_value',
    {
      attribute_value_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      attribute_id: DataTypes.INTEGER,
      value: DataTypes.STRING,
    },
    {},
  );
  attributevalue.associate = (models) => {
    // associations can be defined here
    attributevalue.belongsTo(models.attribute, { foreignKey: 'attribute_id' });
    attributevalue.belongsToMany(models.product, {
      as: 'products',
      through: 'product_attribute',
      foreignKey: 'attribute_value_id',
    });
  };
  return attributevalue;
};
