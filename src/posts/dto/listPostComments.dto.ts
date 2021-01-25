import { IsNumber, IsPositive, Max } from 'class-validator';
import { ListPostCommentsQuery } from '../domain/repository';

export class ListPostCommentsDto {
  constructor(obj: Partial<ListPostCommentsDto>) {
    Object.assign(this, obj);
  }

  @IsNumber()
  @Max(100)
  limit: number = 10;

  @IsNumber()
  @IsPositive()
  page: number = 1;

  query?: ListPostCommentsQuery;
}
