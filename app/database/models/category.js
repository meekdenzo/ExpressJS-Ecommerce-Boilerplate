module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define(
    'category',
    {
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      department_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {},
  );
  category.associate = function (models) {
    // associations can be defined here
    category.belongsToMany(models.product, {
      as: 'products',
      through: 'product_category',
      foreignKey: 'category_id',
    });
    category.belongsTo(models.department, { foreignKey: 'department_id' });
  };
  return category;
};
