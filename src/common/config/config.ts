import { IsBoolean, IsIn, IsInt, IsString, ValidateNested } from 'class-validator';
import { MongodbConfig } from './mongodbConfig';

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

  @IsString()
  graphqlSchemaPath: string = process.env.GRAPHQL_SCHEMA_PATH || 'api/graphql/**/*.graphql';

  @IsBoolean()
  graphqlPlayground: boolean =
    process.env.GRAPHQL_PLAYGROUND === 'true' || process.env.GRAPHQL_PLAYGROUND === '1' || this.env === 'dev';

  @ValidateNested()
  mongodbConfig: MongodbConfig = new MongodbConfig();
}
