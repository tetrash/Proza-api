import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../domain/user';

export class CreateUserDto {
  constructor(obj: Partial<CreateUserDto>) {
    Object.assign(this, obj);
  }

  @IsString()
  username: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsEnum(UserRole)
  role: string;
}
