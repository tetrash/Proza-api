import { newPost, Post } from './domain/post';
import { Validate } from '../common/decorators/validate';
import { GetPostDto } from './dto/getPost.dto';
import { ListPostsDto } from './dto/listPosts.dto';
import { DomainPaginationResult } from '../common/interfaces/domainPaginationResult';
import { CreatePostDto } from './dto/createPost.dto';
import { ServiceContext } from '../common/interfaces/serviceContext';
import { HasRole } from '../common/decorators/hasRole';
import { UserRole } from '../users/domain/user';
import { NotAuthenticatedError } from '../common/errors/errors';
import { PostRepository } from './domain/repository';

export class PostsService {
  constructor(private readonly postRepo: PostRepository) {}

  @Validate(GetPostDto)
  async getPost(payload: GetPostDto): Promise<Post> {
    return this.postRepo.getPost(payload.postId);
  }

  @Validate(ListPostsDto)
  async listPosts(payload: ListPostsDto): Promise<DomainPaginationResult<Post>> {
    return this.postRepo.listPosts(payload.limit, payload.page || 1);
  }

  @HasRole([UserRole.admin, UserRole.moderator])
  @Validate(CreatePostDto)
  async createPost(payload: CreatePostDto, ctx: ServiceContext): Promise<Post> {
    if (!ctx.user) {
      throw new NotAuthenticatedError();
    }

    const id = this.postRepo.generateId();
    const post: Post = newPost({ ...payload, id, author: ctx.user.id });
    await this.postRepo.createPost(post);
    return post;
  }
}
