import { DomainPaginationResult } from '../../common/interfaces/domainPaginationResult';

export interface Post {
  id: string;
  owner: string;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

export function newPost(payload: Partial<Post>): Post {
  return {
    id: payload.id || '',
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
