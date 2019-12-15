import gql from 'graphql-tag';

export const ENCOUNTERS_QUERY = gql`
{
  encounters {
    success
    encounters {
      id
      timestamp
      opponent {
        firstName
        lastName
      }
      isCanceled
    }
  }
}
`;
