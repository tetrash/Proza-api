import { gql } from '@apollo/client';

export const CREATE_POST = gql`
  mutation CreatePost($title: String!, $body: String!) {
    createPost(post: { title: $title, body: $body }) {
      id
    }
  }
`;

export interface CreatePostResult {
  createPost: {
    id: string;
  };
}
