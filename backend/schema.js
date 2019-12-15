const { gql } = require('apollo-server');
const { PATIENT, DOCTOR, ADMIN } = require('./src/constants/userRoles');

const typeDefs = gql`
type Query {
  users(role: UserRole): [User]!
  me(token: String!): User
  encounters: EncountersResponse
}
type Encounter {
  id: ID!
  timestamp: Float!
  doctorId: ID!
  patientId: ID!
  isCanceled: Boolean!
}

type EncounterWithOpponent {
  id: ID!
  timestamp: Float!
  opponent: ShortUser!
  isCanceled: Boolean!
}

type User {
  id: ID!
  firstName: String!
  lastName: String!
  email: String!
  role: UserRole
  accessToken: String
}

type ShortUser {
  firstName: String!
  lastName: String!
}

type Mutation {
  bookEncounter(doctorId: ID!, timestamp: Float!): EncounterUpdateResponse!
  login(email: String, password: String!): UserResponse!
  register(email: String, firstName: String, lastName: String, password: String, role: UserRole): UserResponse!
  cancelEncounter(encounterId: ID!): EncounterUpdateResponse!
}
enum UserRole {
  ${PATIENT}
  ${DOCTOR}
  ${ADMIN}
}
type EncounterUpdateResponse {
  success: Boolean!
  message: String
  encounter: Encounter
}

type UserResponse {
  success: Boolean!
  user: User
}

type EncountersResponse {
  success: Boolean!
  message: String
  encounters: [EncounterWithOpponent]
}
`;

module.exports = typeDefs;
