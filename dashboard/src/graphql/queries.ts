import { gql } from '@apollo/client';

export const GET_USER_DATA = gql`
  query getUserData {
    me {
      id
      email
      username
      fullName
      avatarUrl
      role
    }
  }
`

export interface GetUserData {
  me: {
    id: string;
    email?: string;
    username?: string;
    fullName?: string;
    avatarUrl?: string;
    role: string;
  }
}