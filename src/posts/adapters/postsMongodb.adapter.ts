import { Post, UpdatedPost } from '../domain/post';
import { getModelForClass } from '@typegoose/typegoose';
import { PostEntity, PostEntityMapper } from '../entities/post.entity';
import { DomainPaginationResult } from '../../common/interfaces/domainPaginationResult';
import { NotFoundError } from '../../common/errors/errors';
import { v4 } from 'uuid';
import { ListPostCommentsQuery, PostRepository } from '../domain/repository';
import { PostComment, UpdatedPostComment } from '../domain/postComment';
import { PostCommentEntity, PostCommentEntityMapper } from '../entities/postComment.entity';
import { PostCommentVoteEntity } from '../entities/postCommentVote.entity';

export class PostsMongodbAdapter implements PostRepository {
  private readonly postCommentMapper = new PostCommentEntityMapper();
  private readonly postMapper = new PostEntityMapper(this.postCommentMapper);

  constructor(
    private readonly PostModel = getModelForClass(PostEntity),
    private readonly PostCommentModel = getModelForClass(PostCommentEntity),
    private readonly PostCommentVoteModel = getModelForClass(PostCommentVoteEntity),
  ) {}

  async getPost(postId: string): Promise<Post> {
    const result = await this.PostModel.findById(postId).populate(['author']).lean();

    if (!result) {
      throw new NotFoundError('Post not found');
    }

    return this.postMapper.toDomain(result);
  }

  async listPosts(limit: number = 10, page: number): Promise<DomainPaginationResult<Post>> {
    const result = await this.PostModel.paginate(
      {},
      { limit, page, lean: true, populate: ['author'], sort: { createdAt: -1 } },
    );

    if (!result) {
      return { items: [], totalItems: 0, page: 1, totalPages: 1, nextPage: null, previousPage: null };
    }

    const items = result.docs.map((doc) => this.postMapper.toDomain(doc));

    return {
      items,
      nextPage: result.hasNextPage && result.nextPage ? result.nextPage : null,
      previousPage: result.hasPrevPage && result.prevPage ? result.prevPage : null,
      totalItems: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page || page,
    };
  }

  async createPost(post: Post): Promise<void> {
    const payload = this.postMapper.toEntity(post);
    await this.PostModel.create(payload);
  }

  generateId(): string {
    return v4();
  }

  async deletePost(postId: string): Promise<void> {
    await this.PostModel.deleteOne({ _id: postId });
  }

  async updatePost(post: UpdatedPost): Promise<void> {
    const { id, ...body } = post;
    await this.PostModel.updateOne({ _id: id }, { $set: body });
  }

  async listPostComments(
    limit: number,
    page: number,
    query?: ListPostCommentsQuery,
  ): Promise<DomainPaginationResult<PostComment>> {
    const result = await this.PostCommentModel.paginate(query, {
      limit,
      page: 1,
      populate: ['author', 'votes', 'responses'],
      sort: { createdAt: 1 },
    });

    if (!result) {
      return { items: [], totalItems: 0, page: 1, totalPages: 1, nextPage: null, previousPage: null };
    }

    const items = result.docs.map((comment) => this.postCommentMapper.toDomain(comment));
    return {
      items,
      nextPage: result.hasNextPage && result.nextPage ? result.nextPage : null,
      previousPage: result.hasPrevPage && result.prevPage ? result.prevPage : null,
      totalItems: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page || page,
    };
  }

  async createPostComment(comment: PostComment): Promise<void> {
    const payload = this.postCommentMapper.toEntity(comment);
    await this.PostCommentModel.create(payload);
    if (payload.post) {
      await this.PostModel.updateOne({ _id: comment.post }, { $push: { comments: payload._id } });
    }
    if (payload.commentRef) {
      await this.PostCommentModel.updateOne({ _id: comment.commentRef }, { $push: { responses: payload._id } });
    }
  }

  async deletePostComment(postCommentId: string): Promise<void> {
    await this.PostCommentModel.deleteOne({ _id: postCommentId });
  }

  async updatePostComment(comment: UpdatedPostComment): Promise<void> {
    const { id, ...body } = comment;
    await this.PostModel.updateOne({ _id: id }, { $set: body });
  }

  async createOrUpdatePostCommentVote(postCommentId: string, userId: string, vote: number): Promise<void> {
    const result = await this.PostCommentVoteModel.findOneAndUpdate(
      { author: userId, comment: postCommentId },
      { value: vote },
      { upsert: true, new: true, rawResult: true },
    );

    if (result.value && !result.lastErrorObject.updatedExisting) {
      await this.PostCommentModel.updateOne({ _id: postCommentId }, { $push: { votes: result.value._id } });
    }
  }

  async getPostResponses(commentId: string): Promise<PostComment[]> {
    const comments = await this.PostCommentModel.find({ commentRef: commentId }).populate(['votes', 'author']);
    return comments.map((comment) => this.postCommentMapper.toDomain(comment));
  }
}
