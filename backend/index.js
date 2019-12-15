const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const getConnection = require('./src/connection');
const User = require('./src/models/User');
const Encounter = require('./src/models/Encounter');
const { ADMIN } = require('./src/constants/userRoles');
const UserApi = require('./src/datasources/UserApi');
const EncounterApi = require('./src/datasources/EncounterApi');
const resolvers = require('./src/resolvers');
const createAdmin = require('./src/startHooks/createAdmin');

const connection = getConnection();
User.sync();
Encounter.sync();

(async function runHooks() {
  await createAdmin({ UserModel: User });
})();

const server = new ApolloServer({
  typeDefs,
  dataSources: () => ({
    usersAPI: new UserApi({ User }),
    encounterAPI: new EncounterApi({ Encounter, User }),
  }),
  resolvers,
  context: async ({ req }) => {
    // get the user token from the headers
    const token = (req.headers.authorization || '').split(' ')[1];

    if (!token) {
      return {};
    }

    // try to retrieve a user with the token
    const user = await User.findOne({ where: { accessToken: token } });

    // add the user to the context
    return { user };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

