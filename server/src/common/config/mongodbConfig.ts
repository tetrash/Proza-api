import { IsOptional, IsString } from 'class-validator';

export class MongodbConfig {
  constructor(params?: Partial<MongodbConfig>) {
    Object.assign(this, params);
  }

  @IsString({ message: 'missing variable PROZA_MONGODB_URL' })
  url: string = process.env.PROZA_MONGODB_URL || 'mongodb://localhost:27017/';

  @IsString({ message: 'missing variable PROZA_MONGODB_DB_NAME' })
  dbName: string = process.env.PROZA_MONGODB_DB_NAME || 'Proza';

  @IsString({ message: 'missing variable PROZA_MONGODB_USER' })
  @IsOptional()
  user?: string = process.env.PROZA_MONGODB_USER;

  @IsString({ message: 'missing variable PROZA_MONGODB_PASSWORD' })
  @IsOptional()
  password?: string = process.env.PROZA_MONGODB_PASSWORD;
}
