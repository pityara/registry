const Sequelize = require('sequelize');
const getConnection = require('../connection');
const User = require('./User');

const sequelize = getConnection();

class Encounter extends Sequelize.Model { }
Encounter.init({
  timestamp: Sequelize.INTEGER,
  isCanceled: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: true },
  doctorId: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  patientId: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
}, { sequelize, modelName: 'encounter' });

module.exports = Encounter;
