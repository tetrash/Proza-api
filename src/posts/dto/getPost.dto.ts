import { IsString } from 'class-validator';

export class GetPostDto {
  constructor(obj: Partial<GetPostDto>) {
    Object.assign(this, obj);
  }

  @IsString()
  postId!: string;
}
