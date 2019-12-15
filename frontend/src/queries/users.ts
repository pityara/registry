import gql from 'graphql-tag';

export const USERS_QUERY = gql`
query Users($role: UserRole) {
  users(role: $role) {
    id
    firstName
    lastName
    email
    role
  }
}
`;
