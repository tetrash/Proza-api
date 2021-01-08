import { IsNumber, IsOptional, IsPositive, Max } from 'class-validator';

export class ListPostsDto {
  constructor(obj: Partial<ListPostsDto>) {
    Object.assign(this, obj);
  }

  @IsNumber()
  @Max(100)
  limit: number = 10;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  page?: number;
}
