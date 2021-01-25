import { IsString } from 'class-validator';

export class CommentPostDto {
  constructor(obj: Partial<CommentPostDto>) {
    Object.assign(this, obj);
  }

  @IsString()
  postId: string;

  @IsString()
  body: string;
}
