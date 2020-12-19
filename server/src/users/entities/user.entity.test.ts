import { UserEntity, UserEntityMapper } from './user.entity';
import { newUser } from '../domain/user';

describe('user entity', () => {
  describe('UserEntityMapper', () => {
    const mapper = new UserEntityMapper();

    it('should map domain object to entity', () => {
      const result = newUser({ id: 'id', username: 'test' });
      expect(mapper.toEntity(result)).toBeInstanceOf(UserEntity);
    });

    it('should map entity to domain object', () => {
      const result = new UserEntity({
        _id: 'id',
        role: 'test',
        username: 'test',
      });

      expect(mapper.toDomain(result)).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          username: expect.any(String),
          role: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });
  });
});
