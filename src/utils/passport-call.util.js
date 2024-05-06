import passport from "passport";
import { logger } from "../middlewares/logger.middleware.js";

const passportCall = (strategy) => {
  return (req, res, next) => {
    try {
      passport.authenticate(strategy, (error, user, info) => {
        if (error) {
          return next(error);
        }

        if (!user) {
          return res.status(401).redirect("/api/login");
        }

        req.user = user;

        next();
      })(req, res, next);
    } catch (error) {
      logger.error("Error al realizar autenticación");
      res.send({ error: "An error occurred during authentication." });
    }
  };
};

export default passportCall;
