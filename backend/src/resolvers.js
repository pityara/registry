module.exports = {
  Query: {
    users: (_, { role }, { dataSources }) => dataSources.usersAPI.getUsers(role),
    me: async (_, { token }, { dataSources }) => await dataSources.usersAPI.getMeFromContext(token),
    encounters: (_, __, { dataSources }) => dataSources.encounterAPI.getEncounters(),
  },
  Mutation: {
    register: async (_, { firstName, lastName, email, password, role }, { dataSources }) => {
      const user = await dataSources.usersAPI.create({ email, password, firstName, lastName, role });

      return {
        success: true,
        user,
      };
    },
    login: (_, { email, password }, { dataSources }) => {
      return dataSources.usersAPI.login({ email, password });
    },
    bookEncounter: async (_, { doctorId, timestamp }, { dataSources }) => dataSources.encounterAPI.bookEncounter(doctorId, timestamp),
    cancelEncounter: async (_, { encounterId }, { dataSources }) => dataSources.encounterAPI.cancelEncounter(encounterId),
  }
};
