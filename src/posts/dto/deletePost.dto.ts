import { IsString } from 'class-validator';

export class DeletePostDto {
  constructor(obj: Partial<DeletePostDto>) {
    Object.assign(this, obj);
  }

  @IsString()
  postId: string;
}
