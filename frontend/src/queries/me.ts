import gql from 'graphql-tag';

export const ME_QUERY = gql`
query Me($token: String!){
  me(token: $token) {
    id
    firstName
    lastName
    email
    role
  }
}
`;
