const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const customer = sequelize.define(
    'customer',
    {
      customer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      credit_card: DataTypes.TEXT
    },
    {
      hooks: {
        beforeSave: async currentCustomer => {
          if (currentCustomer.changed('credit_card')) {
            const salt = await bcrypt.genSalt();
            currentCustomer.credit_card = bcrypt.hashSync(currentCustomer.credit_card, salt);
          }
        }
      }
    }
  );

  customer.prototype.getName = function() {
    return `${this.first_name} ${this.last_name}`;
  };

  customer.associate = models => {
    // associations can be defined here
    customer.hasMany(models.orders, { foreignKey: 'customer_id' });
    customer.belongsTo(models.user, { foreignKey: 'user_id' });
    customer.hasMany(models.address, { foreignKey: 'customer_id' });
  };
  return customer;
};
