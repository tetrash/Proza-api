import { JsonplaceholderRepository } from '../../src/posts/adapters/jsonplaceholder.repository';

describe('posts service', () => {
  const repo = new JsonplaceholderRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPost', () => {
    it('should successfully fetch posts', async () => {
      const request = repo.getPost(1);
      await expect(request).resolves.not.toThrow();
    });
  });

  describe('listPosts', () => {
    it('should successfully list posts', async () => {
      const request = repo.listPosts();
      await expect(request).resolves.not.toThrow();
    });
  });
});
