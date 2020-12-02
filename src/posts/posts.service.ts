import { Post, PostRepository } from './domain/post';
import { Validate } from '../common/decorators/validate';
import { GetPostDto } from './dto/getPost.dto';

export class PostsService {
  constructor(private readonly postRepo: PostRepository) {}

  @Validate(GetPostDto)
  async getPost(payload: GetPostDto): Promise<Post> {
    return this.postRepo.getPost(payload.postId);
  }

  async listPosts(): Promise<Post[]> {
    return this.postRepo.listPosts();
  }
}
