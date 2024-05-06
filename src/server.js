import express from "express";
import { router } from "./router/index.js";

import { ExpressHandlebars } from "express-handlebars";
import { mongoConnect } from "./db/index.js";
import cookieParser from "cookie-parser";
import session from "express-session";

import { initializePassport } from "./configs/passport.config.js";
import passport from "passport";
import { winstonLogger } from "./middlewares/logger.middleware.js";
import { registerHandlebarsHelpers } from "./helpers/handlebars.helpers.js";
const handlebars = new ExpressHandlebars();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(process.cwd() + "/src/public"));
app.use(
  session({
    secret: "8-bits",

    resave: false,
    saveUninitialized: false,
  })
);
app.use(winstonLogger);

initializePassport();
app.use(passport.initialize());
registerHandlebarsHelpers();
app.engine("handlebars", handlebars.engine);

app.set("views", process.cwd() + "/src/views");
app.set("view engine", "handlebars");

router(app);
mongoConnect();

export { app };
