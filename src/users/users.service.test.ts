import { UsersService } from './users.service';
import { mock } from 'jest-mock-extended';
import { newUser, UserRepository, UserRole } from './domain/user';

describe('users service', () => {
  const userRepo = mock<UserRepository>();
  const service = new UsersService(userRepo);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create new user', async () => {
      const payload = { fullName: 'test', role: UserRole.user, username: 'test' };
      const id = 'id';
      const result = service.createUser(payload);
      userRepo.createUser.mockResolvedValue();
      userRepo.generateId.mockReturnValue(id);
      await expect(result).resolves.toMatchObject({ ...payload, id });
      expect(userRepo.generateId).toHaveBeenCalled();
      expect(userRepo.createUser).toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('should get user', async () => {
      const payload = { userId: 'id' };
      const user = newUser({ id: 'id', username: 'test' });
      const result = service.getUser(payload);
      userRepo.getUser.mockResolvedValue(user);
      await expect(result).resolves.toEqual(user);
      expect(userRepo.getUser).toHaveBeenCalledWith('id');
    });
  });
});
