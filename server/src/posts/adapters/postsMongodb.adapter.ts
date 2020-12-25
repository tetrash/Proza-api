import { Post } from '../domain/post';
import { getModelForClass } from '@typegoose/typegoose';
import { PostEntity, PostEntityMapper } from '../entities/post.entity';
import { DomainPaginationResult } from '../../common/interfaces/domainPaginationResult';
import { NotFoundError } from '../../common/errors/errors';
import { v4 } from 'uuid';
import { PostRepository } from '../domain/repository';

export class PostsMongodbAdapter implements PostRepository {
  private readonly mapper = new PostEntityMapper();

  constructor(private readonly PostModel = getModelForClass(PostEntity)) {}

  async getPost(postId: string): Promise<Post> {
    const result = await this.PostModel.findById(postId).populate(['author']).lean();

    if (!result) {
      throw new NotFoundError('Post not found');
    }

    return this.mapper.toDomain(result);
  }

  async listPosts(limit: number = 10, page: number): Promise<DomainPaginationResult<Post>> {
    const result = await this.PostModel.paginate(
      {},
      { limit, page, lean: true, populate: ['author'], sort: { createdAt: -1 } },
    );

    if (!result) {
      return { items: [], totalItems: 0, page: 1, totalPages: 1, nextPage: null, previousPage: null };
    }

    const items = result.docs.map((doc) => this.mapper.toDomain(doc));

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
    const payload = this.mapper.toEntity(post);
    await this.PostModel.create(payload);
  }

  generateId(): string {
    return v4();
  }

  async deletePost(postId: string): Promise<void> {
    await this.PostModel.deleteOne({ _id: postId });
  }
}
