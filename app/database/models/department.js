module.exports = (sequelize, DataTypes) => {
  const department = sequelize.define(
    'department',
    {
      department_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {},
  );
  department.associate = function (models) {
    // associations can be defined here
    department.hasMany(models.category, { as: 'categories', foreignKey: 'department_id' });
  };
  return department;
};
