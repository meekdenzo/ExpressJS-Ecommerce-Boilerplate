module.exports = (sequelize, DataTypes) => {
  const product = sequelize.define(
    'product',
    {
      product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.DOUBLE,
      discounted_price: DataTypes.DOUBLE,
      image: DataTypes.STRING,
      image_2: DataTypes.STRING,
      thumbnail: DataTypes.STRING,
      display: DataTypes.BOOLEAN,
    },
    {},
  );
  product.associate = function (models) {
    // associations can be defined here
    product.belongsToMany(models.category, {
      as: 'categories',
      through: 'product_category',
      foreignKey: 'product_id',
    });
    product.belongsToMany(models.attribute_value, {
      as: 'attributevalues',
      through: 'product_attribute',
      foreignKey: 'product_id',
    });
    product.hasMany(models.review, { as: 'reviews', foreignKey: 'product_id' });
    product.hasMany(models.shopping_cart, { as: 'shopingCarts', foreignKey: 'product_id' });
  };
  return product;
};
