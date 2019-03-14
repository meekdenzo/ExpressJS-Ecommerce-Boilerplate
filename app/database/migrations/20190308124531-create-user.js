module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('user', {
      user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.TEXT
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: 'CUSTOMER'
      },
      facebook_access_token: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('user')
};
