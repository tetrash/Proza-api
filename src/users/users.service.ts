import { Validate } from '../common/decorators/validate';
import { CreateUserDto } from './dto/createUser.dto';
import { newUser, User, UserRepository } from './domain/user';
import { GetUserDto } from './dto/getUser.dto';

export class UsersService {
  constructor(private readonly userRepo: UserRepository) {}

  @Validate(CreateUserDto)
  async createUser(payload: CreateUserDto): Promise<User> {
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
