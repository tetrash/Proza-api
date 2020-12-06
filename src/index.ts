import { WinstonLogger } from './common/logger/winstonLogger';
import { Config } from './common/config/config';
import { validateOrReject } from 'class-validator';
import { GraphqlServer } from './common/clients/graphql';
import { connect } from 'mongoose';
import { IResolvers } from 'apollo-server-express';

const config = new Config();
const winstonLogger = new WinstonLogger(config.logLevel);

const resolvers: IResolvers[] = [];

async function init() {
  await validateOrReject(config);
  await connect(config.mongodbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: config.mongodbConfig.dbName,
    user: config.mongodbConfig.user,
    pass: config.mongodbConfig.password,
    autoCreate: true,
  });

  const graphqlServer = new GraphqlServer(config, winstonLogger, resolvers);

  await graphqlServer.start();
}

init().catch((err) => {
  winstonLogger.critical(err.toString());
  process.exit(1);
});
