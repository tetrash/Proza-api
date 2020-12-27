import { IsArray, IsIn, IsInt, IsString, IsUrl, ValidateNested } from 'class-validator';
import { MongodbConfig } from './mongodbConfig';
import { AuthConfig } from './authConfig';

export class Config {
  constructor(params?: Partial<Config>) {
    Object.assign(this, params);
  }

  @IsInt()
  port: number = Number(process.env.PORT) || 4000;

  @IsUrl({
    require_protocol: true,
    require_valid_protocol: true,
    require_host: true,
    allow_protocol_relative_urls: false,
    protocols: ['http', 'https'],
    require_tld: false,
  })
  domain: string = process.env.PROZA_DOMAIN || `http://localhost:${this.port}`;

  @IsIn(['debug', 'info', 'warn', 'error', 'http'])
  logLevel: string = process.env.LOG_LEVEL || 'http';

  @IsIn(['dev', 'prod', 'test'])
  env: string = process.env.PROZA_ENV || 'dev';

  isDevEnv: boolean = this.env === 'dev';

  isProdEnv: boolean = this.env === 'prod';

  @ValidateNested()
  mongodb: MongodbConfig = new MongodbConfig();

  @ValidateNested()
  auth: AuthConfig = new AuthConfig();

  @IsString()
  dashboardUri: string = process.env.PROZA_DASHBOARD_URI || '/dashboard';

  @IsArray()
  corsOrigin: string[] = process.env.PROZA_CORS_ORIGINS ? process.env.PROZA_CORS_ORIGINS.split(' ') : [];
}
