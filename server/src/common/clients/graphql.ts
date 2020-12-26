import express from 'express';
import { ApolloError, ApolloServer, IResolvers } from 'apollo-server-express';
import { addResolversToSchema, GraphQLFileLoader, loadSchemaSync, mergeResolvers } from 'graphql-tools';
import { Config } from '../config/config';
import { Logger } from '../logger/logger';
import cors from 'cors';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import session, { Session } from 'express-session';
import { postsResolver } from '../../posts/ports/graphql';
import { User } from '../../users/domain/user';
import { createUserRouter } from '../../users/ports/express';
import { usersResolver } from '../../users/ports/graphql';
import { Connection } from 'mongoose';
import mongoStoreFactory from 'connect-mongo';
import { CustomError, ErrorType, InternalError } from '../errors/errors';

export interface ApolloContext {
  user?: User;
  session: Session;
}

declare module 'express-session' {
  interface Session {
    accessToken: string;
    user: User;
  }
}

const resolvers: IResolvers[] = [postsResolver, usersResolver];

export class GraphqlServer {
  private readonly app = express();
  private readonly gqlServer: ApolloServer;

  constructor(
    private readonly config: Config,
    private readonly logger: Logger,
    private readonly mongoConnection: Connection,
  ) {
    const schema = addResolversToSchema({
      schema: this.loadGraphqlSchemas('api/graphql/**/*.graphql'),
      resolvers: mergeResolvers(resolvers),
    });

    this.gqlServer = new ApolloServer({
      schema,
      logger: this.logger,
      playground: this.config.isDevEnv
        ? {
            settings: {
              'request.credentials': 'include',
            },
          }
        : false,
      introspection: this.config.isDevEnv,
      debug: this.config.isDevEnv,
      context: (context): ApolloContext => {
        const { user } = context.req.session;
        return {
          user,
          session: context.req.session,
        };
      },
      formatError: (error) => {
        const originalErr = error.originalError as Error | CustomError;
        let err: CustomError = new InternalError(originalErr.message);

        if (originalErr instanceof CustomError && originalErr.type) {
          err = originalErr;
        }

        if (err.type === ErrorType.Internal) {
          this.logger.error(err.stack || err.message);
        } else {
          this.logger.debug(err.message);
        }

        return new ApolloError(err.message, err.type);
      },
    });
  }

  private loadGraphqlSchemas(path: string) {
    return loadSchemaSync(path, {
      loaders: [new GraphQLFileLoader()],
    });
  }

  private setupOAuth2() {
    this.logger.info('Setting up oauth2 client');
    const userRouter = createUserRouter(this.config.auth.oauth2);
    this.app.use('/auth', userRouter);
  }

  private setupExpressSession() {
    const MongoStore = mongoStoreFactory(session);
    this.app.use(
      session({
        secret: this.config.auth.sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: this.config.isProdEnv,
          httpOnly: this.config.isProdEnv,
        },
        store: new MongoStore({ mongooseConnection: this.mongoConnection }),
      }),
    );
  }

  async start(): Promise<void> {
    this.app.use(
      cors({
        origin: this.config.corsOrigin,
        credentials: true,
      }),
    );
    this.app.use(helmet({ contentSecurityPolicy: this.config.env === 'dev' ? false : undefined }));
    this.app.use(bodyParser.json());
    this.setupExpressSession();

    if (this.config.auth.isOAuth2Enabled) {
      this.setupOAuth2();
    }

    this.gqlServer.applyMiddleware({ app: this.app, cors: { credentials: true, origin: true } });

    this.app.listen(this.config.port, () => {
      this.logger.info(`App is running at port ${this.config.port}`);
      if (this.config.isDevEnv) {
        this.logger.info(`Open graphql playground http://localhost:${this.config.port}/graphql`);
      }
    });
  }
}
