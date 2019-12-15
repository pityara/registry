const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const getConnection = require('../connection');
const { ADMIN, PATIENT, DOCTOR } = require('../constants/userRoles');

const sequelize = getConnection();

class User extends Sequelize.Model {
  async validPassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  toDTO() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      role: this.role,
      accessToken: this.accessToken,
    }
  }
}
User.init({
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  accessToken: Sequelize.STRING,

  role: Sequelize.ENUM(ADMIN, PATIENT, DOCTOR)
}, { sequelize, modelName: 'user' });

User.beforeCreate((user, options) => {
  return bcrypt.hash(user.password, 16)
    .then(hash => {
      user.password = hash;
    })
    .catch(err => {
      throw new Error();
    });
});

module.exports = User;
