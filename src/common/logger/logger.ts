export interface Logger {
  info(msg: string): void;

  debug(msg: string): void;

  error(msg: string): void;

  warn(msg: string): void;

  critical(msg: string): void;

  http(msg: string): void;
}
