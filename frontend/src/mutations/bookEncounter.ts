import gql from 'graphql-tag';

export const BOOK_ENCOUNTER = gql`
mutation BookEncounter($doctorId: ID!, $timestamp: Float!) {
  bookEncounter(doctorId: $doctorId, timestamp: $timestamp) {
    success
    message
    encounter {
      id
      doctorId
      patientId
      isCanceled
      timestamp
    }
  }
}
`;
