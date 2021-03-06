import { newPost, Post } from './domain/post';
import { PostsService } from './posts.service';
import { mock } from 'jest-mock-extended';
import { DomainPaginationResult } from '../common/interfaces/domainPaginationResult';
import { PostRepository } from './domain/repository';

describe('posts service', () => {
  const postsRepo = mock<PostRepository>();
  const service = new PostsService(postsRepo);

  const post: Post = {
    id: 'testId',
    title: 'testTitle',
    body: 'testBody',
    author: 'testOwner',
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
        page: 1,
        previousPage: null,
        nextPage: null,
        totalPages: 1,
        totalItems: 1,
      };
      postsRepo.listPosts.mockResolvedValue(expected);
      const result = service.listPosts({ limit: 2 });
      await expect(result).resolves.toEqual(expected);
    });
  });

  describe('createPost', () => {
    it('should return post', async () => {
      const payload = { title: 'test', body: 'test' };
      postsRepo.createPost.mockResolvedValue();
      postsRepo.generateId.mockReturnValue('id');
      const result = service.createPost(payload, { user: { id: 'str', role: 'admin' } as any });
      await expect(result).resolves.toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          body: expect.any(String),
          author: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });
  });

  describe('deletePost', () => {
    it('should delete post', async () => {
      postsRepo.deletePost.mockResolvedValue(undefined);
      const result = service.deletePost({ postId: 'postId' }, { user: { id: 'str', role: 'admin' } as any });
      await expect(result).resolves.toEqual(true);
    });
  });

  describe('updatePost', () => {
    it('should update post', async () => {
      const post = newPost({ id: 'postId' });
      postsRepo.updatePost.mockResolvedValue(undefined);
      postsRepo.getPost.mockResolvedValue(post);

      const result = service.updatePost(
        { id: 'postId', title: 'title' },
        { user: { id: 'str', role: 'admin' } as any },
      );

      await expect(result).resolves.toEqual(post);
      expect(postsRepo.updatePost).toHaveBeenCalledWith({ id: 'postId', title: 'title', updatedAt: expect.any(Date) });
      expect(postsRepo.getPost).toHaveBeenCalledWith('postId');
    });
  });
});
