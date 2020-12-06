import { newPost } from '../domain/post';

describe('post entity', () => {
  describe('newPost', () => {
    it('should create new post', () => {
      const result = newPost({});
      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          body: expect.any(String),
          owner: expect.any(String),
        }),
      );
    });
  });
});
