import { User, UserRepository } from '../domain/user';
import { UserEntity, UserEntityMapper } from '../entities/user.entity';
import { getModelForClass } from '@typegoose/typegoose';
import { v4 } from 'uuid';
import { NotFoundError } from '../../common/errors/errors';

export class UsersMongodbAdapter implements UserRepository {
  private readonly mapper = new UserEntityMapper();

  constructor(private readonly userModel = getModelForClass(UserEntity)) {}

  async createUser(payload: User): Promise<void> {
    const user = this.mapper.toEntity(payload);
    await this.userModel.create(user);
  }

  async getUser(userId: string): Promise<User> {
    const result = await this.userModel.findById(userId);
    if (!result) {
      throw new NotFoundError('User not found');
    }

    return this.mapper.toDomain(result);
  }

  generateId(): string {
    return v4();
  }

  async getUserByOpenid(openid: string, openidSource: string): Promise<User | null> {
    const result = await this.userModel.findOne({ openid: { $eq: openid }, openidSource: { $eq: openidSource } });
    if (!result) {
      return null;
    }
    return this.mapper.toDomain(result);
  }

  async createOrReplaceUser(payload: User): Promise<void> {
    const { _id, ...user } = this.mapper.toEntity(payload);
    await this.userModel.findByIdAndUpdate(_id, user, { upsert: true });
  }
}
