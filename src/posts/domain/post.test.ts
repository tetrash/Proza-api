import { IncorrectInputError } from '../../common/errors/errors';
import { newPost, updatePost } from './post';

describe('post domain', () => {
  describe('newPost', () => {
    it('should create new post', () => {
      const user = newPost({ id: 'id', title: 'title', body: 'body', author: 'author' });
      expect(user).toEqual({
        id: 'id',
        title: 'title',
        body: 'body',
        commentsCount: expect.any(Number),
        author: 'author',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should throw if missing required properties', () => {
      const noId = () => newPost({});
      expect(noId).toThrow(IncorrectInputError);
    });
  });

  describe('updatePost', () => {
    it('should update post', () => {
      const post = updatePost({ id: 'id', title: 'title', body: 'body' });
      expect(post).toEqual({
        id: 'id',
        title: 'title',
        body: 'body',
        updatedAt: expect.any(Date),
      });
    });

    it('should throw if missing required properties', () => {
      const noId = () => updatePost({});
      const noPostBody = () => updatePost({ id: 'id' });

      expect(noId).toThrow(IncorrectInputError);
      expect(noPostBody).toThrow(IncorrectInputError);
    });
  });
});
