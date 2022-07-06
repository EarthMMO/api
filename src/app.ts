// @ts-nocheck
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import multer from "multer";
import { mnemonicToSeedSync } from "bip39";
import { networkInterfaces } from "os";

import defaultLogger, { logger } from "utils/logger";
import errorMiddleware from "middlewares/error.middleware";
import eventRouter from "routes/event.router";
import groupRouter from "routes/group.router";
import userRouter from "routes/user.router";
import { connect } from "utils/db_connect";

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet()); // TODO use corsOptions on production)
app.use(express.json({ limit: "10MB" }));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(defaultLogger);
app.use("/static", express.static("static"));

const port = process.env.PORT;

const getNetworkAddress = () => {
  const nets = networkInterfaces();
  const results = Object.create(null); // Or just '{}', an empty object
  Object.keys(nets).map((name) =>
    nets[name].map((net: any) => {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net?.family === "IPv4" && !net?.internal) {
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
  if (port !== "8000") {
    getNetworkAddress();
  } else {
    process.env.SERVER_ADDRESS = "localhost";
  }
  const seed = mnemonicToSeedSync(process.env.MNEMONIC);
  process.env.SEED_HEX = seed.toString("hex");

  const CORE_API_PATH_PREFIX = `/api/v${process.env.SERVER_VERSION as string}`;
  app.use(`${CORE_API_PATH_PREFIX}/user`, userRouter);
  app.use(`${CORE_API_PATH_PREFIX}/event`, eventRouter);
  app.use(`${CORE_API_PATH_PREFIX}/group`, groupRouter);
  app.use(errorMiddleware);

  logger.info(`Server running on ${process.env.SERVER_ADDRESS}:${port}`);
});

app.use(function (err, req, res, next) {
  console.log("MULTER ERROR", err);
  if (err instanceof multer.MulterError) {
    res.statusCode = 400;
    res.send(err.code);
  } else if (err) {
    if (err.message === "FILE_MISSING") {
      res.statusCode = 400;
      res.send("FILE_MISSING");
    } else {
      res.statusCode = 500;
      res.send("GENERIC_ERROR");
    }
  }
});
