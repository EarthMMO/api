// @ts-nocheck
const bip39 = require('bip39');
const bodyParser = require('body-parser');
const { networkInterfaces } = require('os');
import cors from 'cors';
import defaultLogger, { logger } from './src/utils/logger';
import dotenv from 'dotenv';
import errorMiddleware from './src/middleware/error.middleware';
import eventRouter from './src/routers/event.router';
import express from 'express';
import groupRouter from './src/routers/group.router';
import helmet from 'helmet';
import multer from 'multer';
import userRouter from './src/routers/user.router';
import { connect } from './src/utils/db_connect';

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet()); // TODO use corsOptions on production)
app.use(express.json({ limit: '10MB' }));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(defaultLogger);
app.use('/static', express.static('static'));

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
  app.use(`${CORE_API_PATH_PREFIX}/event`, eventRouter);
  app.use(`${CORE_API_PATH_PREFIX}/group`, groupRouter);
  app.use(errorMiddleware);

  logger.info(`Server running on port ${process.env.SERVER_ADDRESS}:${port}`);
});

app.use(function (err, req, res, next) {
  console.log('MULTER ERROR', err);
  if (err instanceof multer.MulterError) {
    res.statusCode = 400;
    res.send(err.code);
  } else if (err) {
    if (err.message === 'FILE_MISSING') {
      res.statusCode = 400;
      res.send('FILE_MISSING');
    } else {
      res.statusCode = 500;
      res.send('GENERIC_ERROR');
    }
  }
});
