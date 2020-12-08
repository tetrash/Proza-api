import { DomainPaginationResult } from '../../common/interfaces/domainPaginationResult';
import { IncorrectInputError } from '../../common/errors/errors';

export interface Post {
  id: string;
  owner: string;
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
    owner: payload.owner || 'Unknown',
    title: payload.title || 'Title',
    body: payload.body || '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export interface PostRepository {
  getPost(postId: string): Promise<Post>;
  listPosts(limit: number, nextToken?: string): Promise<DomainPaginationResult<Post>>;
  createPost(post: Post): Promise<void>;
  generateId(): string;
}
