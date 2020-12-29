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
import { createUserGithubAuthRouter } from '../../users/ports/githubAuthExpress';
import { usersResolver } from '../../users/ports/graphql';
import { Connection } from 'mongoose';
import mongoStoreFactory from 'connect-mongo';
import { CustomError, ErrorType, InternalError } from '../errors/errors';
import { createAuthRouter } from '../../users/ports/authExpress';
import { createUserOidcAuthRouter } from '../../users/ports/oidcAuthExpress';
import { createUserGoogleAuthRouter } from '../../users/ports/googleAuthExpress';
import { createUserLinkedinAuthRouter } from '../../users/ports/linkedinAuthExpress';

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
          this.logger.debug(err.stack || err.message);
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

  private setupLogout() {
    const path = `${this.config.auth.authPrefixPath}`;
    this.logger.debug(`Setting auth router at path ${path}`);
    const authRouter = createAuthRouter();
    this.app.use(path, authRouter);
  }

  private setupGithubAuth() {
    const path = `${this.config.auth.authPrefixPath}/github`;
    this.logger.info('Setting up github oauth2 user authentication');
    this.logger.debug(`Github auth path ${path}`);
    const githubRouter = createUserGithubAuthRouter(this.config.auth.githubAuth);
    this.app.use(path, githubRouter);
  }

  private async setupOidcAuth() {
    const path = `${this.config.auth.authPrefixPath}/oidc`;
    this.logger.info('Setting up oidc user authentication');
    this.logger.debug(`Oidc auth path ${path}`);
    const oidcRouter = await createUserOidcAuthRouter(
      this.config.auth.oidcAuth,
      `${this.config.domain}${path}/callback`,
    );
    this.app.use(path, oidcRouter);
  }

  private async setupGoogleAuth() {
    const path = `${this.config.auth.authPrefixPath}/google`;
    this.logger.info('Setting up google user authentication');
    this.logger.debug(`Google auth path ${path}`);
    const oidcRouter = await createUserGoogleAuthRouter(
      this.config.auth.googleAuth,
      `${this.config.domain}${path}/callback`,
    );
    this.app.use(path, oidcRouter);
  }

  private async setupLinkedinAuth() {
    const path = `${this.config.auth.authPrefixPath}/linkedin`;
    this.logger.info('Setting up linkedin user authentication');
    this.logger.debug(`Linkedin auth path ${path}`);
    const router = await createUserLinkedinAuthRouter(
      this.config.auth.linkedinAuth,
      `${this.config.domain}${path}/callback`,
    );
    this.app.use(path, router);
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

    if (this.config.auth.isGithubAuth) {
      this.setupGithubAuth();
    }

    if (this.config.auth.isOidcAuth) {
      await this.setupOidcAuth();
    }

    if (this.config.auth.isGoogleAuth) {
      await this.setupGoogleAuth();
    }

    if (this.config.auth.isLinkedinAuth) {
      await this.setupLinkedinAuth();
    }

    this.setupLogout();

    this.gqlServer.applyMiddleware({ app: this.app, cors: { credentials: true, origin: true } });

    this.app.listen(this.config.port, () => {
      this.logger.info(`App is running at port ${this.config.port}`);
      if (this.config.isDevEnv) {
        this.logger.info(`Open graphql playground http://localhost:${this.config.port}/graphql`);
      }
    });
  }
}
