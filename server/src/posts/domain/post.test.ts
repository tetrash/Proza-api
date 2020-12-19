import { IncorrectInputError } from '../../common/errors/errors';
import { newPost } from './post';

describe('post domain', () => {
  describe('newPost', () => {
    it('should create new user', () => {
      const user = newPost({ id: 'id' });
      expect(user).toEqual(
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

    it('should throw if missing required properties', () => {
      const noId = () => newPost({});
      expect(noId).toThrow(IncorrectInputError);
    });
  });
});
