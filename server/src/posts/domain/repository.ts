import { DomainPaginationResult } from '../../common/interfaces/domainPaginationResult';
import { Post } from './post';

export interface PostRepository {
  getPost(postId: string): Promise<Post>;
  listPosts(limit: number, page: number): Promise<DomainPaginationResult<Post>>;
  createPost(post: Post): Promise<void>;
  generateId(): string;
}
