import { IsIn, IsInt, ValidateNested } from 'class-validator';
import { MongodbConfig } from './mongodbConfig';
import { AuthConfig } from './authConfig';

export class Config {
  constructor(params?: Partial<Config>) {
    Object.assign(this, params);
  }

  @IsInt()
  port: number = Number(process.env.PORT) || 3000;

  @IsIn(['debug', 'info', 'warn', 'error', 'http'])
  logLevel: string = process.env.LOG_LEVEL || 'http';

  @IsIn(['dev', 'prod', 'test'])
  env: string = process.env.ENV || 'dev';

  isDevEnv: boolean = this.env === 'dev';

  isProdEnv: boolean = this.env === 'prod';

  @ValidateNested()
  mongodb: MongodbConfig = new MongodbConfig();

  @ValidateNested()
  auth: AuthConfig = new AuthConfig();
}
