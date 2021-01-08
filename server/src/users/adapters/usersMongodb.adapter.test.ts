import { getModelForClass } from '@typegoose/typegoose';
import { UserEntity } from '../entities/user.entity';
import { UsersMongodbAdapter } from './usersMongodb.adapter';
import { NotFoundError } from '../../common/errors/errors';
import { newUser } from '../domain/user';

describe('users mongodb adapter', () => {
  const userModel = getModelForClass(UserEntity);
  const adapter = new UsersMongodbAdapter(userModel);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('should return user', async () => {
      const result = new UserEntity({ _id: 'test', role: 'test', username: 'test' });
      jest.spyOn(userModel, 'findById').mockResolvedValue(result as any);
      await expect(adapter.getUser('')).resolves.toEqual(
        expect.objectContaining({
          id: expect.any(String),
          username: expect.any(String),
          role: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });

    it('should throw NotFoundError if user not found', async () => {
      jest.spyOn(userModel, 'findById').mockReturnValue(null as any);
      await expect(adapter.getUser('')).rejects.toThrow(NotFoundError);
    });
  });

  describe('generateId', () => {
    it('should return id', () => {
      expect(adapter.generateId()).toEqual(expect.any(String));
    });
  });

  describe('createUser', () => {
    it('should create user', async () => {
      const payload = newUser({ id: 'id', username: 'test' });

      jest.spyOn(userModel, 'create').mockResolvedValue(undefined as any);
      await expect(adapter.createUser(payload)).resolves.not.toThrow();
      const { id, ...result } = payload;
      expect(userModel.create).toHaveBeenCalledWith({ ...result, _id: id });
    });
  });

  describe('getUserByOpenid', () => {
    it('should return user', async () => {
      const result = new UserEntity({ _id: 'id', role: 'test', username: 'test', openid: 'openid' });
      jest.spyOn(userModel, 'findOne').mockResolvedValue(result as any);

      await expect(adapter.getUserByOpenid('', '')).resolves.toEqual(
        expect.objectContaining({
          id: expect.any(String),
          username: expect.any(String),
          role: expect.any(String),
          openid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });

    it("should return null if user doesn't exist", async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(undefined as any);

      await expect(adapter.getUserByOpenid('', '')).resolves.toEqual(null);
    });
  });

  describe('createOrReplaceUser', () => {
    it('should create user', async () => {
      const payload = newUser({ id: 'id', username: 'test' });

      jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(undefined as any);
      await expect(adapter.createOrReplaceUser(payload)).resolves.not.toThrow();
      const { id, ...result } = payload;
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(id, result, { upsert: true });
    });
  });
});
