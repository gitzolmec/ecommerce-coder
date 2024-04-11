const { validarAmbiente } = require("../utils/winston/factory.winston");
const { winstonUser } = require("../configs/winston.config");

const winstonLogger = (req, res, next) => {
  const logger = validarAmbiente(winstonUser);

  req.logger = logger;

  next();
};

const logger = validarAmbiente(winstonUser);

module.exports = { winstonLogger, logger };
