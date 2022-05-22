import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import defaultLogger, { logger } from './src/utils/logger';
import { connect } from './src/utils/db_connect';
import userRouter from './src/routers/user.router';
import errorMiddleware from './src/middleware/error.middleware';
const bip39 = require('bip39');
import cors from 'cors';

const { networkInterfaces } = require('os');

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet()); // TODO use corsOptions on production)
app.use(express.json({ limit: '1MB' }));
app.use(defaultLogger);

const port = process.env.PORT;

const getNetworkAddress = () => {
  const nets = networkInterfaces();
  const results = Object.create(null); // Or just '{}', an empty object
  Object.keys(nets).map((name) =>
    nets[name].map((net: any) => {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net?.family === 'IPv4' && !net?.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    })
  );
  process.env.SERVER_ADDRESS = results.eth0
    ? results.eth0[0]
    : results.wifi0[0];
};

app.listen(port, async () => {
  await connect();
  getNetworkAddress();
  const seed = bip39.mnemonicToSeedSync(process.env.MNEMONIC);
  process.env.SEED_HEX = seed.toString('hex');

  const CORE_API_PATH_PREFIX = `/api/v${process.env.SERVER_VERSION as string}`;
  app.use(`${CORE_API_PATH_PREFIX}/user`, userRouter);
  app.use(errorMiddleware);

  logger.info(`Server running on port ${process.env.SERVER_ADDRESS}:${port}`);
});
