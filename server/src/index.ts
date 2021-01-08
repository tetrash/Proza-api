import { WinstonLogger } from './common/logger/winstonLogger';
import { Config } from './common/config/config';
import { validate } from 'class-validator';
import { GraphqlServer } from './common/clients/graphql';
import { connect } from 'mongoose';
import { config as dotenv } from 'dotenv';
import { IncorrectInputError } from './common/errors/errors';

dotenv();

const config = new Config();
const winstonLogger = new WinstonLogger(config.logLevel);

async function init() {
  const errors = await validate(config);

  if (errors.length) {
    throw new IncorrectInputError(errors);
  }

  const mongo = await connect(config.mongodb.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
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
