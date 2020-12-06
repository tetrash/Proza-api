import { newPost, Post, PostRepository } from './domain/post';
import { Validate } from '../common/decorators/validate';
import { GetPostDto } from './dto/getPost.dto';
import { ListPostsDto } from './dto/listPosts.dto';
import { DomainPaginationResult } from '../common/interfaces/domainPaginationResult';
import { CreatePostDto } from './dto/createPost.dto';

export class PostsService {
  constructor(private readonly postRepo: PostRepository) {}

  @Validate(GetPostDto)
  async getPost(payload: GetPostDto): Promise<Post> {
    return this.postRepo.getPost(payload.postId);
  }

  @Validate(ListPostsDto)
  async listPosts(payload: ListPostsDto): Promise<DomainPaginationResult<Post>> {
    return this.postRepo.listPosts(payload.limit, payload.nextToken);
  }

  @Validate(CreatePostDto)
  async createPost(payload: CreatePostDto): Promise<Post> {
    const id = this.postRepo.generateId();
    const post: Post = newPost({ ...payload, id });
    await this.postRepo.createPost(post);
    return post;
  }
}
