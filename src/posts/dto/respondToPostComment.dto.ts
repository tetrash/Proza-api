import { IsString } from 'class-validator';

export class RespondToPostCommentDto {
  constructor(obj: Partial<RespondToPostCommentDto>) {
    Object.assign(this, obj);
  }

  @IsString()
  postCommentId: string;

  @IsString()
  body: string;
}
