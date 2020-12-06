import { Post, PostRepository } from '../domain/post';
import { DocumentType, getModelForClass } from '@typegoose/typegoose';
import { PostEntity, PostEntityMapper } from '../entities/post.entity';
import { DomainPaginationResult } from '../../common/interfaces/domainPaginationResult';
import { PaginateResult } from 'mongoose';
import { NotFoundError } from '../../common/errors/errors';
import { v4 } from 'uuid';

export class MongodbAdapter implements PostRepository {
  private readonly mapper = new PostEntityMapper();

  constructor(private readonly PostModel = getModelForClass(PostEntity)) {}

  async getPost(postId: string): Promise<Post> {
    const result: DocumentType<PostEntity> | null = await this.PostModel.findById(postId);

    if (!result) {
      throw new NotFoundError('Post not found');
    }

    return this.mapper.toDomain(result);
  }

  async listPosts(limit: number = 10, nextToken?: string): Promise<DomainPaginationResult<Post>> {
    const next = Number(nextToken);
    const page = !Number.isNaN(next) ? next : 1;

    const result: PaginateResult<DocumentType<PostEntity>> | null = await this.PostModel.paginate({}, { limit, page });

    if (!result) {
      return { items: [] };
    }

    const items = result.docs.map((doc) => this.mapper.toDomain(doc));

    return {
      items,
      nextToken: typeof result.nextPage === 'number' ? result.nextPage.toString() : undefined,
    };
  }

  async createPost(post: Post): Promise<void> {
    const payload = this.mapper.toEntity(post);
    await this.PostModel.create(payload);
  }

  generateId(): string {
    return v4();
  }
}
