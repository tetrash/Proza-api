import * as express from 'express';
import { ApolloServer, IResolvers } from 'apollo-server-express';
import { addResolversToSchema, GraphQLFileLoader, loadSchemaSync, mergeResolvers } from 'graphql-tools';
import { Config } from '../config/config';
import { Logger } from '../logger/logger';
import * as cors from 'cors';
import * as helmet from 'helmet';
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

export interface ApolloContext {
  userId: string;
  userEmail: string;
  username: string;
}

export class GraphqlServer {
  private readonly app = express();
  private readonly gqlServer: ApolloServer;

  constructor(private readonly config: Config, private readonly logger: Logger, resolvers: IResolvers[]) {
    const schema = addResolversToSchema({
      schema: this.loadGraphqlSchemas(this.config.graphqlSchemaPath),
      resolvers: mergeResolvers(resolvers),
    });

    this.gqlServer = new ApolloServer({
      schema,
      logger: this.logger,
      playground: this.config.graphqlPlayground,
      introspection: this.config.graphqlPlayground,
      context: (context): ApolloContext => {
        return {
          userId: context.req.headers['x-forwarded-user'],
          userEmail: context.req.headers['x-forwarded-email'],
          username: context.req.headers['x-forwarded-preferred-username'],
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
    this.app.use((req, res, next) => {
      req.id = v4();
      next();
    });

    this.gqlServer.applyMiddleware({ app: this.app });

    this.app.listen(this.config.port, () => {
      this.logger.info(`App is running at port ${this.config.port}`);
      this.logger.info(`Open graphql playground http://localhost:${this.config.port}/graphql`);
    });
  }
}
