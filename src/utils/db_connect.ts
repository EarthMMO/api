import Mongoose from "mongoose";

import { logger } from "utils/logger";

let database: Mongoose.Connection;

export const connect = async () => {
  const uri = process.env.MONGO_DEV_URL as string;
  if (database) {
    return;
  }
  try {
    await Mongoose.connect(uri);
    logger.info(`Connected to MongoDB...${uri.split("@")[1]}`);
  } catch (e) {
    logger.error("Error connecting to mongodb...", e);
  }
};

export const disconnect = () => {
  if (!database) {
    return;
  }
  Mongoose.disconnect();
};
