import { WinstonLogger } from './common/logger/winstonLogger';
import { Config } from './common/config/config';
import { validateOrReject } from 'class-validator';
import { GraphqlServer } from './common/clients/graphql';
import { connect } from 'mongoose';
import { config as dotenv } from 'dotenv';

dotenv();

const config = new Config();
const winstonLogger = new WinstonLogger(config.logLevel);

async function init() {
  await validateOrReject(config);
  const mongo = await connect(config.mongodb.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: config.mongodb.dbName,
    user: config.mongodb.user,
    pass: config.mongodb.password,
    autoCreate: true,
  });

  const graphqlServer = new GraphqlServer(config, winstonLogger, mongo.connection);

  await graphqlServer.start();
}

init().catch((err) => {
  winstonLogger.critical(err.toString());
  process.exit(1);
});
