import { IsString } from 'class-validator';

export class GetUserDto {
  constructor(obj: Partial<GetUserDto>) {
    Object.assign(this, obj);
  }

  @IsString()
  userId: string;
}
