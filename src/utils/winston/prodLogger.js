import winston from "winston";
import { format } from "winston";
import { customWinston } from "./custom.winston.js";

winston.addColors(customWinston.colors);
const loggerFormat = format.combine(
  winston.format.colorize({ all: true }),
  winston.format.simple()
);

const winstonLogger = winston.createLogger({
  levels: customWinston.levels,
  format: loggerFormat,
  transports: [
    new winston.transports.Console({
      level: "info",
    }),
    new winston.transports.File({
      filename: "errors.log",
      level: "error",
    }),
  ],
});

export { winstonLogger };
