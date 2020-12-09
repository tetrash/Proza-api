import express from 'express';
import { ApolloServer, IResolvers } from 'apollo-server-express';
import { addResolversToSchema, GraphQLFileLoader, loadSchemaSync, mergeResolvers } from 'graphql-tools';
import { Config } from '../config/config';
import { Logger } from '../logger/logger';
import cors from 'cors';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

export interface ApolloContext {
  userId?: string;
  userEmail?: string;
  username?: string;
}

export class GraphqlServer {
  private readonly app = express();
  private readonly gqlServer: ApolloServer;

  constructor(private readonly config: Config, private readonly logger: Logger, resolvers: IResolvers[]) {
    const schema = addResolversToSchema({
      schema: this.loadGraphqlSchemas('api/graphql/**/*.graphql'),
      resolvers: mergeResolvers(resolvers),
    });

    this.gqlServer = new ApolloServer({
      schema,
      logger: this.logger,
      playground: this.config.isDevEnv,
      introspection: this.config.isDevEnv,
      debug: this.config.isDevEnv,
      context: (context): ApolloContext => {
        const userIdHeader = context.req.headers['x-forwarded-user'];
        const userId = Array.isArray(userIdHeader) ? userIdHeader[0] : userIdHeader;
        const userEmailHeader = context.req.headers['x-forwarded-email'];
        const userEmail = Array.isArray(userEmailHeader) ? userEmailHeader[0] : userEmailHeader;
        const usernameHeader = context.req.headers['x-forwarded-preferred-username'];
        const username = Array.isArray(usernameHeader) ? usernameHeader[0] : usernameHeader;
        return {
          userId,
          userEmail,
          username,
        };
      },
    });
  }

  private loadGraphqlSchemas(path: string) {
    return loadSchemaSync(path, {
      loaders: [new GraphQLFileLoader()],
    });
  }

  async start() {
    this.app.use(cors());
    this.app.use(helmet({ contentSecurityPolicy: this.config.env === 'dev' ? false : undefined }));
    this.app.use(bodyParser.json());

    this.gqlServer.applyMiddleware({ app: this.app });

    this.app.listen(this.config.port, () => {
      this.logger.info(`App is running at port ${this.config.port}`);
      if (this.config.isDevEnv) {
        this.logger.info(`Open graphql playground http://localhost:${this.config.port}/graphql`);
      }
    });
  }
}
