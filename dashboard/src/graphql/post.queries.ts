import { gql } from '@apollo/client';

export const LIST_POSTS = gql`
  query ListPosts($page: Int, $limit: Int) {
    listPosts(paginate: { page: $page, limit: $limit }) {
      items {
        id
        title
        author {
          id
          fullname
          username
        }
        createdAt
        updatedAt
      }
      page
      previousPage
      nextPage
      totalItems
      totalPages
    }
  }
`;

export interface PostAuthor {
  id: string;
  fullname: string;
  username: string;
}

export interface Post {
  id: string;
  title: string;
  author?: PostAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface ListPosts {
  listPosts: {
    items: Post[];
    page: number;
    previousPage?: number;
    nextPage?: number;
    totalItems: number;
    totalPages: number;
  };
}

export const GET_POST = gql`
  query GetPost($postId: String!) {
    getPost(postId: $postId) {
      id
      body
      title
      createdAt
      updatedAt
    }
  }
`;

export interface GetPostResult {
  getPost: {
    id: string;
    body: string;
    title: string;
    createdAt: string;
    updatedAt: string;
  };
}
