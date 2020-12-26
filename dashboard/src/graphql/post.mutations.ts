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

export interface UpdatePostInput {
  postId: string;
  title?: string;
  body?: string;
}

export const UPDATE_POST = gql`
  mutation UpdatePost($postId: String!, $title: String, $body: String) {
    updatePost(post: { body: $body, title: $title, id: $postId }) {
      title
      body
    }
  }
`;

export interface UpdatePostResult {
  updatePost: {
    title: string;
    body: string;
  };
}

export interface DeletePostInput {
  postId: string;
}

export const DELETE_POST = gql`
  mutation DeletePost($postId: String!) {
    deletePost(postId: $postId)
  }
`;

export interface DeletePostResult {
  deletePost: boolean;
}
