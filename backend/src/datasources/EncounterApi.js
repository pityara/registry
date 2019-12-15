const { DataSource } = require('apollo-datasource');
const { DOCTOR, PATIENT } = require('../constants/userRoles');
const { Op } = require('sequelize');

class EncounterAPI extends DataSource {
  constructor({ Encounter, User }) {
    super();
    this.models = { Encounter, User };
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

  async bookEncounter(doctorId, timestamp) {
    if (!this.context.user) {
      return {
        success: false,
        message: 'unauthorized',
      };
    }

    const alreadyBooked = await this.models.Encounter.findOne({
      where: {
        timestamp,
        doctorId,
      },
    });

    if (alreadyBooked) {
      return {
        success: false,
        message: 'already-booked',
      };
    }

    const encounter = await this.models.Encounter.create({
      doctorId,
      patientId: this.context.user.id,
      timestamp,
    });

    return {
      success: true,
      encounter,
    };
  }

  async getEncounters() {
    try {
      const { user } = this.context;
      if (!user) {
        return {
          success: false,
          message: 'unauthorized',
        };
      }
      const now = Math.floor(Date.now() / 1000);

      const filter = {
        isCanceled: false,
        timestamp: {
          [Op.gt]: now,
        },
      };

      if (user.role === DOCTOR) {
        filter.doctorId = user.id;
      } else if (user.role === PATIENT) {
        filter.patientId = user.id;
      }

      const encounterModels = await this.models.Encounter.findAll({
        where: filter,
      });

      const encounters = await Promise.all(encounterModels.map(async e => {
        const opponent = user.role === DOCTOR
          ? await this.models.User.findOne({ where: { id: e.patientId } })
          : await this.models.User.findOne({ where: { id: e.doctorId } });
        return {
          id: e.id,
          timestamp: e.timestamp,
          isCanceled: e.isCanceled,
          opponent: {
            firstName: opponent.firstName,
            lastName: opponent.lastName,
          },
        };
      }));

      return {
        success: true,
        encounters,
      };
    } catch (err) {
      console.log(err);

      return {
        success: false
      };
    }
  }

  async cancelEncounter(encounterId) {
    const { user } = this.context;
    if (!user) {
      return {
        success: false,
        message: 'unauthorized',
      };
    }

    const encounter = await this.models.Encounter.findOne({
      where: {
        id: encounterId,
        [Op.or]: [
          { patientId: user.id },
          { doctorId: user.id },
        ],
        isCanceled: false,
      },
    });

    if (!encounter) {
      return {
        success: false,
        message: 'forbidden',
      }
    }

    encounter.isCanceled = true;

    await encounter.save();

    return {
      success: true,
      encounter,
    };
  }
}

module.exports = EncounterAPI;
