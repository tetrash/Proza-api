import { IsArray, IsIn, IsInt, IsString, IsUrl, ValidateNested } from 'class-validator';
import { MongodbConfig } from './mongodbConfig';
import { AuthConfig } from './authConfig';

const availableEnv = ['dev', 'prod', 'test'];
const availableLogLevels = ['debug', 'info', 'warn', 'error', 'http'];

export class Config {
  constructor(params?: Partial<Config>) {
    Object.assign(this, params);
  }

  @IsInt()
  port: number = Number(process.env.PORT) || 4000;

  @IsUrl(
    {
      require_protocol: true,
      require_valid_protocol: true,
      require_host: true,
      allow_protocol_relative_urls: false,
      protocols: ['http', 'https'],
      require_tld: false,
    },
    { message: 'missing variable PROZA_DOMAIN' },
  )
  domain: string = process.env.PROZA_DOMAIN || `http://localhost:${this.port}`;

  @IsIn(availableLogLevels, {
    message: `incorrect variable PROZA_LOG_LEVEL, available: ${availableLogLevels.join(', ')}`,
  })
  logLevel: string = process.env.PROZA_LOG_LEVEL || 'http';

  @IsIn(availableEnv, { message: `incorrect variable PROZA_ENV, available: ${availableEnv.join(', ')}` })
  env: string = process.env.PROZA_ENV || 'dev';

  isDevEnv: boolean = this.env === 'dev';

  isProdEnv: boolean = this.env === 'prod';

  @ValidateNested()
  mongodb: MongodbConfig = new MongodbConfig();

  @ValidateNested()
  auth: AuthConfig = new AuthConfig();

  @IsString({ message: 'missing variable PROZA_DASHBOARD_URI' })
  dashboardUri: string = process.env.PROZA_DASHBOARD_URI || this.domain;

  @IsArray()
  corsOrigin: string[] = process.env.PROZA_CORS_ORIGINS ? process.env.PROZA_CORS_ORIGINS.split(' ') : [];
}
