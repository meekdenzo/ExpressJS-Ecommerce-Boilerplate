module.exports = (sequelize, DataTypes) => {
  const attribute = sequelize.define(
    'attribute',
    {
      attribute_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
    },
    {},
  );
  attribute.associate = () => {
    // associations can be defined here
  };
  return attribute;
};
