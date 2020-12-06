import { Post } from './domain/post';
import { PostsService } from './posts.service';
import Mock = jest.Mock;
import { MongodbAdapter } from './adapters/mongodb.adapter';

jest.mock('./adapters/mongodb.adapter');

describe('posts service', () => {
  const postsRepo = new MongodbAdapter();
  const service = new PostsService(postsRepo);

  const post: Post = {
    id: 'testId',
    title: 'testTitle',
    body: 'testBody',
    owner: 'testOwner',
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPost', () => {
    it('should return post', async () => {
      const expected: Post = post;
      (postsRepo.getPost as Mock).mockImplementationOnce(() => expected);
      const result = service.getPost({ postId: '1' });
      await expect(result).resolves.toEqual(expected);
    });
  });

  describe('listPosts', () => {
    it('should return list of posts', async () => {
      const expected = [post];
      (postsRepo.listPosts as Mock).mockImplementationOnce(() => expected);
      const result = service.listPosts({ limit: 2 });
      await expect(result).resolves.toEqual(expected);
    });
  });

  describe('createPost', () => {
    it('should return post', async () => {
      const payload = { title: 'test', body: 'test', owner: 'test' };
      const expected: Post = { ...post, ...payload };
      (postsRepo.createPost as Mock).mockImplementationOnce(() => expected);
      const result = service.createPost(payload);
      await expect(result).resolves.toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          body: expect.any(String),
          owner: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });
  });
});
