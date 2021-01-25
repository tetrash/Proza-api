import { IsString } from 'class-validator';

export class GetCommentResponsesDto {
  constructor(obj: Partial<GetCommentResponsesDto>) {
    Object.assign(this, obj);
  }

  @IsString()
  postCommentId: string;
}
