import { IsInt, Max, Min } from 'class-validator';

export class GetPostDto {
  constructor(obj: Partial<GetPostDto>) {
    Object.assign(this, obj);
  }

  @IsInt()
  @Min(1)
  @Max(100)
  postId: number = 1;
}
