import { Validate } from '../common/decorators/validate';
import { CreateOrGetUserDto } from './dto/createOrGetUserDto';
import { newUser, User, UserRepository } from './domain/user';
import { GetUserDto } from './dto/getUser.dto';

export class UsersService {
  constructor(private readonly userRepo: UserRepository) {}

  @Validate(CreateOrGetUserDto)
  async createOrGetUser(payload: CreateOrGetUserDto): Promise<User> {
    if (payload.openid) {
      const exist = await this.userRepo.getUserByOpenid(payload.openid);
      if (exist) {
        return exist;
      }
    }

    if (payload.id) {
      return this.userRepo.getUser(payload.id);
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
}
