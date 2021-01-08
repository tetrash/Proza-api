import { Validate } from '../common/decorators/validate';
import { CreateOrGetUserDto } from './dto/createOrGetUser.dto';
import { newUser, User, UserRepository } from './domain/user';
import { GetUserDto } from './dto/getUser.dto';
import { IncorrectInputError } from '../common/errors/errors';
import { CreateOrReplaceUserDto } from './dto/createOrReplaceUser.dto';

export class UsersService {
  constructor(private readonly userRepo: UserRepository) {}

  @Validate(CreateOrGetUserDto)
  async createOrGetUser(payload: CreateOrGetUserDto): Promise<User> {
    if (payload.id) {
      return this.userRepo.getUser(payload.id);
    }

    if (payload.openid) {
      if (!payload.openidSource) {
        throw new IncorrectInputError('Missing openid source');
      }
      const exist = await this.userRepo.getUserByOpenid(payload.openid, payload.openidSource);
      if (exist) {
        return exist;
      }
    }

    const id = this.userRepo.generateId();
    const user = newUser({ ...payload, id });
    await this.userRepo.createUser(user);
    return user;
  }

  @Validate(GetUserDto)
  async getUser(payload: GetUserDto): Promise<User> {
    return this.userRepo.getUser(payload.userId);
  }

  @Validate(CreateOrReplaceUserDto)
  async createOrReplaceUser(payload: CreateOrReplaceUserDto): Promise<User> {
    const user = newUser({ ...payload, id: payload.id || this.userRepo.generateId() });
    await this.userRepo.createOrReplaceUser(user);
    return user;
  }
}
