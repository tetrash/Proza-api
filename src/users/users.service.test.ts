import { UsersService } from './users.service';
import { mock } from 'jest-mock-extended';
import { UserRepository, UserRole } from './domain/user';
import { IncorrectInputError } from '../common/errors/errors';

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
      const payload = {
        fullName: 'test',
        role: UserRole.user,
        username: 'test',
        openid: 'openid',
        openidSource: 'openidSource',
      };
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
      const payload = {
        id: 'id',
        fullName: 'test',
        role: UserRole.user,
        username: 'test',
        openid: 'openid',
        openidSource: 'openidSource',
        createdAt: new Date(1),
        updatedAt: new Date(1),
      };
      const result = service.createOrGetUser(payload);

      userRepo.getUser.mockResolvedValue(payload);

      await expect(result).resolves.toMatchObject(payload);
      expect(userRepo.getUserByOpenid).not.toHaveBeenCalled();
      expect(userRepo.generateId).not.toHaveBeenCalled();
      expect(userRepo.getUser).toHaveBeenCalled();
      expect(userRepo.createUser).not.toHaveBeenCalled();
    });

    it('should return existing user with openid', async () => {
      const id = 'id';
      const payload = {
        fullName: 'test',
        role: UserRole.user,
        username: 'test',
        openid: 'openid',
        openidSource: 'openidSource',
        createdAt: new Date(1),
        updatedAt: new Date(1),
      };
      const result = service.createOrGetUser(payload);

      userRepo.getUserByOpenid.mockResolvedValue({ id, ...payload });

      await expect(result).resolves.toMatchObject({ ...payload, id });
      expect(userRepo.getUserByOpenid).toHaveBeenCalled();
      expect(userRepo.generateId).not.toHaveBeenCalled();
      expect(userRepo.getUser).not.toHaveBeenCalled();
      expect(userRepo.createUser).not.toHaveBeenCalled();
    });

    it('should throw if openid source is missing', async () => {
      const payload = {
        fullName: 'test',
        role: UserRole.user,
        username: 'test',
        openid: 'openid',
        createdAt: new Date(1),
        updatedAt: new Date(1),
      };

      const result = service.createOrGetUser(payload);

      await expect(result).rejects.toThrow(IncorrectInputError);
      expect(userRepo.getUserByOpenid).not.toHaveBeenCalled();
      expect(userRepo.generateId).not.toHaveBeenCalled();
      expect(userRepo.getUser).not.toHaveBeenCalled();
      expect(userRepo.createUser).not.toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('should get user', async () => {
      const payload = { userId: 'id' };
      const user = { id: 'id', username: 'test', role: 'role', createdAt: new Date(1), updatedAt: new Date(1) };
      const result = service.getUser(payload);

      userRepo.getUser.mockResolvedValue(user);

      await expect(result).resolves.toEqual(user);
      expect(userRepo.getUser).toHaveBeenCalledWith('id');
    });
  });

  describe('createOrReplaceUser', () => {
    it('should create new user', async () => {
      const payload = {
        fullName: 'test',
        role: UserRole.user,
        username: 'test',
        openid: 'openid',
        openidSource: 'openidSource',
      };
      const id = 'id';

      userRepo.createOrReplaceUser.mockResolvedValue();
      userRepo.generateId.mockReturnValue(id);

      const result = service.createOrReplaceUser(payload);

      await expect(result).resolves.toMatchObject({ ...payload, id });
      expect(userRepo.createOrReplaceUser).toHaveBeenCalledWith({
        ...payload,
        id,
        updatedAt: expect.any(Date),
        createdAt: expect.any(Date),
      });
      expect(userRepo.generateId).toHaveBeenCalled();
    });

    it('should create new user with id', async () => {
      const payload = {
        id: 'id',
        fullName: 'test',
        role: UserRole.user,
        username: 'test',
        openid: 'openid',
        openidSource: 'openidSource',
      };

      userRepo.createOrReplaceUser.mockResolvedValue();

      const result = service.createOrReplaceUser(payload);

      await expect(result).resolves.toMatchObject(payload);
      expect(userRepo.createOrReplaceUser).toHaveBeenCalledWith({
        ...payload,
        updatedAt: expect.any(Date),
        createdAt: expect.any(Date),
      });
      expect(userRepo.generateId).not.toHaveBeenCalled();
    });
  });
});
