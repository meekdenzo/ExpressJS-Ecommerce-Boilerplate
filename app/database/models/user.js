const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: DataTypes.STRING,
      password: DataTypes.TEXT,
      facebook_access_token: DataTypes.TEXT,
      role: DataTypes.STRING
    },
    {
      hooks: {
        beforeSave: async currentUser => {
          if (currentUser.changed('password')) {
            const salt = await bcrypt.genSalt();
            const { password } = currentUser;
            currentUser.password = bcrypt.hashSync(password, salt);
          }
        }
      }
    }
  );

  user.prototype.validPassword = function async(password) {
    return bcrypt.compareSync(password, this.password);
  };

  user.associate = function(models) {
    user.hasOne(models.customer, { foreignKey: 'user_id' });
  };
  return user;
};
