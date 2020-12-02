import { Post, PostRepository } from '../domain/post';
import axios from 'axios';
import { InternalError, NotFoundError } from '../../common/errors/errors';

export class JsonplaceholderRepository implements PostRepository {
  constructor(private readonly url = 'https://jsonplaceholder.typicode.com') {}

  static parsePost(payload: any): Post {
    if (payload === null || typeof payload !== 'object') {
      throw new InternalError('Post must be an object.');
    }
    return new Post(payload);
  }

  async getPost(postId: number): Promise<Post> {
    try {
      const url = `${this.url}/posts/${postId}`;
      const result = await axios.get(url);
      return JsonplaceholderRepository.parsePost(result.data);
    } catch (e) {
      if (e.response.status === 404) {
        throw new NotFoundError('Post not found');
      }
      throw new InternalError(e);
    }
  }

  async listPosts(): Promise<Post[]> {
    const url = `${this.url}/posts`;
    const result = await axios.get(url);
    if (!Array.isArray(result.data)) {
      throw new InternalError('Post must be an array.');
    }
    return result.data.map((val) => JsonplaceholderRepository.parsePost(val));
  }
}
