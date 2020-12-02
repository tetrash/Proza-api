import { WinstonLogger } from './common/logger/winstonLogger';
import { HttpServer } from './common/server/http';
import { Config } from './common/config/config';
import { validateOrReject } from 'class-validator';
import { postsRouter } from './posts/ports/http';

const config = new Config();
const winstonLogger = new WinstonLogger(config.logLevel);

async function init() {
  await validateOrReject(config);

  const httpServer = new HttpServer(winstonLogger, config.port);

  httpServer.setupCors();
  httpServer.loadMiddlewares();
  if (config.env === 'dev') {
    httpServer.setupDocs('./api/openapi');
  }
  httpServer.loadRoutes([{ prefix: 'posts', router: postsRouter }]);
  httpServer.start();
}

init().catch((err) => {
  winstonLogger.critical(err.toString());
  process.exit(1);
});
