import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../domain/user';

export class CreateOrReplaceUserDto {
  constructor(obj: Partial<CreateOrReplaceUserDto>) {
    Object.assign(this, obj);
  }

  @IsString()
  username: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: string | UserRole;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  openid?: string;

  @IsString()
  @IsOptional()
  openidSource?: string;

  @IsString()
  @IsOptional()
  id?: string;
}
