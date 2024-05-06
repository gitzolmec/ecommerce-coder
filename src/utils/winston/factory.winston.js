import { winstonLogger as logger } from "./logger.js";
import { winstonLogger as prodLogger } from "./prodLogger.js";

function validarAmbiente(winstonUser) {
  winstonUser = winstonUser.trim();
  switch (winstonUser) {
    case "dev":
      return logger;

    case "prod":
      return prodLogger;
  }
}

export { validarAmbiente };
