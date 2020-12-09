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
}
