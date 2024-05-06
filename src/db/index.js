import mongoose from "mongoose";
import { dbUser, dbPassword, dbHost, dbName } from "../configs/db.config.js";
import { logger } from "../middlewares/logger.middleware.js";

const mongoConnect = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`
    );
    logger.info("Connected to DB");
  } catch (err) {
    console.log(err);
  }
};

export { mongoConnect };
