const { DataSource } = require('apollo-datasource');
const { v4 } = require('node-uuid');
const isEmail = require('isemail');
const { PATIENT, ADMIN } = require('../constants/userRoles');

class UserAPI extends DataSource {
  constructor({ User }) {
    super();
    this.models = { User };
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  async getMeFromContext(token) {
    if (!this.context.user) {
      this.context.user = await this.findUserByToken({ accessToken: token });

      return this.context.user.toDTO();
    }

    return this.context.user && this.context.user.toDTO();
  }

  findUserByToken({ accessToken } = {}) {
    return this.models.User.findOne({ where: { accessToken } });
  }

  async create({ email, password, firstName, lastName, role } = {}) {
    let userRole = PATIENT;
    if (role && this.context.user && this.context.user.role === ADMIN) {
      userRole = role;
    }
    if (!isEmail.validate(email)) {
      return null;
    }
    const token = v4();
    const user = await this.models.User.create({
      email,
      firstName,
      lastName,
      password,
      accessToken: token,
      role: userRole
    });

    this.context.user = user;

    return user;
  }

  async login({ email, password } = {}) {
    const user = await this.models.User.findOne({ where: { email } });

    if (!user) {
      return {
        success: false,
      };
    }

    const isPasswordValid = await user.validPassword(password);

    if (!isPasswordValid) {
      return {
        success: false,
      };
    }

    user.accessToken = v4();
    this.context.user = user;
    await user.save();

    return {
      success: true,
      user: user.toDTO(),
    };
  }

  async getUsers(role) {
    const filter = {};

    if (role) {
      filter.role = role;
    }
    const users = await this.models.User.findAll({
      where: filter,
    });

    return users.map(u => u.toDTO())
  }
}

module.exports = UserAPI;
