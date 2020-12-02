import { JsonplaceholderRepository } from './adapters/jsonplaceholder.repository';
import { Post } from './domain/post';
import { PostsService } from './posts.service';
import Mock = jest.Mock;

jest.mock('./adapters/jsonplaceholder.repository');

describe('posts service', () => {
  const postsRepo = new JsonplaceholderRepository();
  const service = new PostsService(postsRepo);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPost', () => {
    it('should return post', async () => {
      const expected = new Post({ id: 1 });
      (postsRepo.getPost as Mock).mockImplementationOnce(() => expected);
      const result = service.getPost({ postId: 1 });
      await expect(result).resolves.toEqual(expected);
    });
  });

  describe('listPosts', () => {
    it('should return list of posts', async () => {
      const expected = [new Post({ id: 1 }), new Post({ id: 2 })];
      (postsRepo.listPosts as Mock).mockImplementationOnce(() => expected);
      const result = service.listPosts();
      await expect(result).resolves.toEqual(expected);
    });
  });
});
