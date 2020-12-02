import { IsIn, IsInt } from 'class-validator';

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
}
