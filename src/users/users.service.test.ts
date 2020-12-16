import { UsersService } from './users.service';
import { mock } from 'jest-mock-extended';
import { newUser, UserRepository, UserRole } from './domain/user';

describe('users service', () => {
  const userRepo = mock<UserRepository>();
  const service = new UsersService(userRepo);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrGetUser', () => {
    it('should create new user', async () => {
      const payload = { fullName: 'test', role: UserRole.user, username: 'test' };
      const id = 'id';
      const result = service.createOrGetUser(payload);

      userRepo.createUser.mockResolvedValue();
      userRepo.generateId.mockReturnValue(id);

      await expect(result).resolves.toMatchObject({ ...payload, id });
      expect(userRepo.getUserByOpenid).not.toHaveBeenCalled();
      expect(userRepo.getUser).not.toHaveBeenCalled();
      expect(userRepo.generateId).toHaveBeenCalled();
      expect(userRepo.createUser).toHaveBeenCalled();
    });

    it("should create new user if user with specified openid doesn't exist", async () => {
      const id = 'id';
      const payload = { fullName: 'test', role: UserRole.user, username: 'test', openid: 'openid' };
      const result = service.createOrGetUser(payload);

      userRepo.getUserByOpenid.mockResolvedValue(null);
      userRepo.createUser.mockResolvedValue();
      userRepo.generateId.mockReturnValue(id);

      await expect(result).resolves.toMatchObject({ ...payload, id });
      expect(userRepo.getUserByOpenid).toHaveBeenCalled();
      expect(userRepo.getUser).not.toHaveBeenCalled();
      expect(userRepo.generateId).toHaveBeenCalled();
      expect(userRepo.createUser).toHaveBeenCalled();
    });

    it('should return existing user', async () => {
      const id = 'id';
      const payload = { id, fullName: 'test', role: UserRole.user, username: 'test', openid: 'openid' };
      const result = service.createOrGetUser(payload);

      userRepo.getUser.mockResolvedValue(newUser(payload));
      userRepo.generateId.mockReturnValue(id);

      await expect(result).resolves.toMatchObject({ ...payload, id });
      expect(userRepo.getUserByOpenid).toHaveBeenCalled();
      expect(userRepo.generateId).not.toHaveBeenCalled();
      expect(userRepo.getUser).toHaveBeenCalled();
      expect(userRepo.createUser).not.toHaveBeenCalled();
    });

    it('should return existing user with openid', async () => {
      const id = 'id';
      const payload = { fullName: 'test', role: UserRole.user, username: 'test', openid: 'openid' };
      const result = service.createOrGetUser({ id, ...payload });

      userRepo.getUserByOpenid.mockResolvedValue(newUser({ id, ...payload }));
      userRepo.generateId.mockReturnValue(id);

      await expect(result).resolves.toMatchObject({ ...payload, id });
      expect(userRepo.getUserByOpenid).toHaveBeenCalled();
      expect(userRepo.generateId).not.toHaveBeenCalled();
      expect(userRepo.getUser).not.toHaveBeenCalled();
      expect(userRepo.createUser).not.toHaveBeenCalled();
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
