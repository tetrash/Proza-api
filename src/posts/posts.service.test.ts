import { Post, PostRepository } from './domain/post';
import { PostsService } from './posts.service';
import { mock } from 'jest-mock-extended';
import { DomainPaginationResult } from '../common/interfaces/domainPaginationResult';

describe('posts service', () => {
  const postsRepo = mock<PostRepository>();
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
      postsRepo.getPost.mockResolvedValue(expected);
      const result = service.getPost({ postId: '1' });
      await expect(result).resolves.toEqual(expected);
    });
  });

  describe('listPosts', () => {
    it('should return list of posts', async () => {
      const expected: DomainPaginationResult<Post> = {
        items: [post],
        nextToken: '',
      };
      postsRepo.listPosts.mockResolvedValue(expected);
      const result = service.listPosts({ limit: 2 });
      await expect(result).resolves.toEqual(expected);
    });
  });

  describe('createPost', () => {
    it('should return post', async () => {
      const payload = { title: 'test', body: 'test', owner: 'test' };
      postsRepo.createPost.mockResolvedValue();
      postsRepo.generateId.mockReturnValue('id');
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
