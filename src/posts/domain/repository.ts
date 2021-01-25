import { DomainPaginationResult } from '../../common/interfaces/domainPaginationResult';
import { Post, UpdatedPost } from './post';
import { PostComment } from './postComment';

export type ListPostCommentsQuery = Pick<PostComment, 'author' | 'post' | 'commentRef'>;

export interface PostRepository {
  getPost(postId: string): Promise<Post>;
  listPosts(limit: number, page: number): Promise<DomainPaginationResult<Post>>;
  createPost(post: Post): Promise<void>;
  deletePost(postId: string): Promise<void>;
  updatePost(post: UpdatedPost): Promise<void>;
  listPostComments(
    limit: number,
    page: number,
    query?: ListPostCommentsQuery,
  ): Promise<DomainPaginationResult<PostComment>>;
  getPostResponses(commentId: string): Promise<PostComment[]>;
  createPostComment(comment: PostComment): Promise<void>;
  updatePostComment(comment: PostComment): Promise<void>;
  deletePostComment(postCommentId: string): Promise<void>;
  createOrUpdatePostCommentVote(postCommentId: string, userId: string, vote: number): Promise<void>;
  generateId(): string;
}
