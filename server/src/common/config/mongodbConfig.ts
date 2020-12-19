import { IsOptional, IsString } from 'class-validator';

export class MongodbConfig {
  constructor(params?: Partial<MongodbConfig>) {
    Object.assign(this, params);
  }

  @IsString()
  url: string = process.env.MONGODB_URL || 'mongodb://localhost:27017/';

  @IsString()
  dbName: string = process.env.MONGODB_DB_NAME || 'Proza';

  @IsString()
  @IsOptional()
  user?: string = process.env.MONGODB_USER;

  @IsString()
  @IsOptional()
  password?: string = process.env.MONGODB_PASSWORD;
}
