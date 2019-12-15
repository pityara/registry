const Sequelize = require('sequelize');

let sequelize = null;

function getConnection() {
  if (!sequelize) {
    sequelize = new Sequelize('registry', 'user', '', {
      dialect: 'postgres'
    });
    sequelize
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.');
      })
      .catch(err => {
        console.error('Unable to connect to the database:', err);
      });
  }

  return sequelize;
}

module.exports = getConnection;
