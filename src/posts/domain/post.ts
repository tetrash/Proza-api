import { IncorrectInputError } from '../../common/errors/errors';
import { PostAuthor } from './postAuthor';
import { PostComment } from './postComment';

export interface Post {
  id: string;
  author: PostAuthor | string;
  title: string;
  body: string;
  comments?: PostComment[];
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export function newPost(payload: Partial<Post>): Post {
  if (!payload.id && typeof payload.id !== 'string') {
    throw new IncorrectInputError('User is missing id field');
  }

  return {
    id: payload.id,
    author: payload.author || '',
    title: payload.title || 'Title',
    body: payload.body || '',
    commentsCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export interface UpdatedPost {
  id: string;
  title?: string;
  body?: string;
  updatedAt: Date;
}

export function updatePost(payload: Partial<Post>): UpdatedPost {
  if (!payload.id && typeof payload.id !== 'string') {
    throw new IncorrectInputError('User is missing id field');
  }

  if (payload.title === undefined && payload.body === undefined) {
    throw new IncorrectInputError('No field has been updated');
  }

  const updatedPost = {
    id: payload.id,
    title: payload.title,
    body: payload.body,
    updatedAt: new Date(),
  };

  return (Object.keys(updatedPost) as (keyof UpdatedPost)[]).reduce((newObj, key) => {
    const updatedPost = newObj;
    if (updatedPost[key] === undefined) {
      delete updatedPost[key];
    }
    return updatedPost;
  }, updatedPost);
}
