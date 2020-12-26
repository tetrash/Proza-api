import { DomainPaginationResult } from '../../common/interfaces/domainPaginationResult';
import { Post, UpdatedPost } from './post';

export interface PostRepository {
  getPost(postId: string): Promise<Post>;
  listPosts(limit: number, page: number): Promise<DomainPaginationResult<Post>>;
  createPost(post: Post): Promise<void>;
  deletePost(postId: string): Promise<void>;
  updatePost(post: UpdatedPost): Promise<void>;
  generateId(): string;
}
