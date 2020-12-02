import { Logger } from './logger';
import * as winston from 'winston';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;
const myFormat = printf(({ level, message, timestamp }) => {
  return `[${level.toUpperCase()}] ${timestamp} ${message}`;
});

export class WinstonLogger implements Logger {
  private readonly logger: winston.Logger;

  constructor(level = 'info') {
    this.logger = createLogger({
      level,
      levels: {
        crit: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        debug: 5,
      },
      format: combine(timestamp(), myFormat),
      transports: [new transports.Console()],
    });
  }

  debug(msg: string): void {
    this.logger.debug(msg);
  }

  error(msg: string): void {
    this.logger.error(msg);
  }

  info(msg: string): void {
    this.logger.info(msg);
  }

  warn(msg: string): void {
    this.logger.warn(msg);
  }

  critical(msg: string): void {
    this.logger.log('crit', msg);
  }

  http(msg: string): void {
    this.logger.http(msg);
  }
}
