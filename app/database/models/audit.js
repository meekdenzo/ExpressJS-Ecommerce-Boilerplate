
module.exports = (sequelize, DataTypes) => {
  const audit = sequelize.define('audit', {
    audit_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    code: DataTypes.INTEGER,
    created_on: DataTypes.DATE,
  }, {});
  audit.associate = function (models) {
    // associations can be defined here
    audit.belongsTo(models.orders, { foreignKey: 'order_id' });
  };
  return audit;
};
