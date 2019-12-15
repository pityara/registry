import gql from 'graphql-tag';

export const REGISTER = gql`
mutation Register($firstName: String!, $lastName: String!, $email: String!, $password: String!, $role: UserRole) {
  register(firstName: $firstName, lastName: $lastName, email: $email, password: $password, role: $role) {
    success
    user {
      id
      firstName
      lastName
      email
      role
      accessToken
    }
  }
}
`;
