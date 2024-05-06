import { validarAmbiente } from "../utils/winston/factory.winston.js";
import { winstonUser } from "../configs/winston.config.js";

const winstonLogger = (req, res, next) => {
  const logger = validarAmbiente(winstonUser);

  req.logger = logger;

  next();
};

const logger = validarAmbiente(winstonUser);

export { winstonLogger, logger };
