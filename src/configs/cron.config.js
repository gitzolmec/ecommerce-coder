import cron from "node-cron";
import { disableUsers } from "../services/users.service.js";
import { logger } from "../middlewares/logger.middleware.js";

export function disableUsersCronJob() {
  disableUsers();

  cron.schedule("*/30 * * * *", () => {
    logger.info(
      "Ejecutando tarea programada para deshabilitar usuarios inactivos cada 30 minutos..."
    );
    disableUsers();
  });
}
