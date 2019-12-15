import gql from 'graphql-tag';

export const CANCEL_ENCOUNTER = gql`
mutation CancelEncounter($encounterId: ID!) {
  cancelEncounter(encounterId: $encounterId) {
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
