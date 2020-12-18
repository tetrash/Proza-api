import { IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  constructor(obj: Partial<CreatePostDto>) {
    Object.assign(this, obj);
  }

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  body?: string;
}
