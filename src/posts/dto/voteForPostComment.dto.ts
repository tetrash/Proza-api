import { IsInt, IsString, Max, Min } from 'class-validator';

export class VoteForPostCommentDto {
  constructor(obj: Partial<VoteForPostCommentDto>) {
    Object.assign(this, obj);
  }

  @IsString()
  postCommentId: string;

  @IsInt()
  @Min(-1)
  @Max(1)
  value: number;
}
