import { IsNumber, IsPositive, Max } from 'class-validator';

export class ListPostsDto {
  constructor(obj: Partial<ListPostsDto>) {
    Object.assign(this, obj);
  }

  @IsNumber()
  @Max(100)
  limit: number = 10;

  @IsNumber()
  @IsPositive()
  page: number = 1;
}
