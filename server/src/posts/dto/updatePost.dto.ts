import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  constructor(obj: Partial<UpdatePostDto>) {
    Object.assign(this, obj);
  }

  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  @IsOptional()
  body?: string;
}
