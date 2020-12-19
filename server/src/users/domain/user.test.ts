import { newUser } from './user';
import { IncorrectInputError } from '../../common/errors/errors';

describe('user domain', () => {
  describe('newUser', () => {
    it('should create new user', () => {
      const user = newUser({ id: 'id', username: 'test' });
      expect(user).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          username: expect.any(String),
          role: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });

    it('should throw if missing required properties', () => {
      const noId = () => newUser({ username: 'test' });
      const noUsername = () => newUser({ id: 'id' });

      expect(noId).toThrow(IncorrectInputError);
      expect(noUsername).toThrow(IncorrectInputError);
    });
  });
});
