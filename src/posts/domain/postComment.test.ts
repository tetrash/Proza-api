import { newPostComment } from './postComment';

describe('post comment domain', () => {
  describe('newPostComment', () => {
    it('should create a new post comment', () => {
      const payload = { id: 'id', author: 'author', body: 'body', post: 'post' };
      const comment = newPostComment(payload);
      expect(comment).toEqual({
        ...payload,
        status: expect.any(String),
        upVotes: expect.any(Number),
        downVotes: expect.any(Number),
        responses: expect.any(Array),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });
});
