import { DomainPaginationResult } from '../../common/interfaces/domainPaginationResult';
import { IncorrectInputError } from '../../common/errors/errors';
import { PostAuthor } from './postAuthor';

export interface Post {
  id: string;
  author: PostAuthor | string;
  title: string;
  body: string;
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
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export interface PostRepository {
  getPost(postId: string): Promise<Post>;
  listPosts(limit: number, page: number): Promise<DomainPaginationResult<Post>>;
  createPost(post: Post): Promise<void>;
  generateId(): string;
}
