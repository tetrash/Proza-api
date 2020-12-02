import { createTerminus } from '@godaddy/terminus';
import * as express from 'express';
import * as http from 'http';
import * as swaggerUi from 'swagger-ui-express';
import * as path from 'path';
import * as glob from 'glob';
import * as yaml from 'yamljs';
import * as cors from 'cors';
import * as helmet from 'helmet';
import { Logger } from '../logger/logger';
import { CustomError, ErrorType, InternalError, NotFoundError } from '../errors/errors';
import { Request, Router } from 'express';
import * as bodyParser from 'body-parser';
import { v4 } from 'uuid';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

export interface CorsOptions {
  origin: string;
  optionsSuccessStatus: number;
}

export class HttpServer {
  private readonly app = express();
  private readonly baseUrl = 'http://localhost';

  constructor(private readonly logger: Logger, private readonly port: number) {}

  private async gracefulShutdown() {
    this.logger.info('Shutting down server...');
  }

  // TODO: implement
  private async onHealthCheck() {
    this.logger.debug('Health check');
  }

  private log(req: Request, msg?: string): string {
    return `${req.method}(${req.id}) ${req.baseUrl}${req.path}: ${msg}`;
  }

  setupDocs(docsPath: string): void {
    const docsPaths = glob.sync(`${docsPath}/*.yaml`);
    docsPaths.forEach((docPath) => {
      const swaggerDocument = yaml.load(docPath);
      const name = path.basename(docPath).replace('.yaml', '');
      const url = `/docs/${name}`;
      this.app.use(url, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
      this.logger.info(`Loaded documentation page "${name}" ${this.baseUrl}:${this.port}${url}/`);
    });
  }

  setupCors(opts?: CorsOptions): void {
    this.logger.debug('Setting up cors');
    this.app.use(cors(opts));
  }

  loadMiddlewares(): void {
    this.logger.debug('Setting up middlewares');
    this.app.use(helmet());
    this.app.use(bodyParser.json());
    this.app.use((req, res, next) => {
      req.id = v4();
      next();
    });
    this.app.use((req, res, next) => {
      res.on('finish', () => {
        this.logger.http(this.log(req, 'status ' + res.statusCode.toString()));
      });
      next();
    });
  }

  loadRoutes(routes: { prefix: string; router: Router }[]): void {
    routes.forEach((route) => {
      this.logger.debug(`Loading router /${route.prefix}`);
      this.app.use('/' + route.prefix, route.router);
    });
  }

  start(): void {
    this.app.use('**', (req, res, next) => next(new NotFoundError("Page doesn't exist")));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.app.use((err, req, res, next) => {
      const error: CustomError = !!err.type ? err : new InternalError(err);
      switch (error.type) {
        case ErrorType.IncorrectInput:
          this.logger.debug(this.log(req, error.errorDetails));
          return res.status(400).json({ error: error.type, details: error.errorDetails });
        case ErrorType.NotFound:
          this.logger.debug(this.log(req, error.errorDetails));
          return res.status(404).json({ error: error.type, details: error.errorDetails });
        default:
          this.logger.error(this.log(req, error.errorDetails || error.stack));
          return res.status(500).json({ error: error.type });
      }
    });

    const server = http.createServer(this.app);

    createTerminus(server, {
      signal: 'SIGINT',
      healthChecks: { '/health': () => this.onHealthCheck() },
      onSignal: this.gracefulShutdown,
    });

    server.listen(this.port, () => {
      this.logger.info(`Server running at ${this.baseUrl}:${this.port}/`);
    });
  }
}
