import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";
import jwt from "passport-jwt";
import { tokenSecret } from "./token.config.js";
import { ghClientSecret, ghClientId } from "./github.config.js";
import { Users } from "../models/users.model.js";
import { cartDao } from "../DAO/Mongo/cart-dao.mongo.js";

import { createHash, useValidPassword } from "../utils/crypt.password.util.js";

import { cookieExtractor } from "../utils/cookie-extractor.util.js";
import { calculateAge } from "../middlewares/calculateAge.middleware.js";
import { generateUserErrorInfo } from "../handlers/errors/generate-error-info.js";
import { EErrors } from "../handlers/errors/enum.error.js";
import { CustomError } from "../handlers/errors/custom.error.js";
import { TYPES_ERRORS } from "../handlers/errors/user-error-types.js";
import { logger } from "../middlewares/logger.middleware.js";
import { formatDate } from "../utils/format-date.util.js";
const carts = new cartDao();
const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, email, age } = req.body;
          console.log(age);
          if (!first_name || !last_name || !email || !age) {
            CustomError.createError({
              name: TYPES_ERRORS.USER_CREATION_ERROR,
              cause: generateUserErrorInfo({
                first_name,
                last_name,
                email,
                age,
              }),
              message: "Error trying to create User",
              code: EErrors.INVALID_USER_INFO,
            });
          }
          const user = await Users.findOne({ email: username });
          if (user) {
            logger.warning("User already exists");
            return done(null, false);
          }
          const userAge = calculateAge(age);
          const cart = await carts.addCart();
          const cartId = cart._id;
          const newUserInfo = {
            first_name,
            last_name,
            age: userAge,
            email,
            password: createHash(password),
            cartId,
          };

          const newUser = await Users.create(newUserInfo);

          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const usuario = await Users.findOne({ email: username });

          if (!usuario) {
            logger.warning("User not found");
            return done(null, false);
          }

          if (!useValidPassword(usuario, password)) {
            return done(null, false);
          }

          if (usuario.status === false) {
            logger.warning("Disabled user");
            return done(null, false);
          }
          const id = usuario._id;
          const lastConnection = await Users.findByIdAndUpdate(id, {
            last_connection: formatDate(Date.now()),
          });
          return done(null, usuario);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: ghClientId,
        clientSecret: ghClientSecret,
        callbackURL: "http://localhost:8080/api/auth/githubcallback",
      },
      async (accessToken, RefreshToken, profile, done) => {
        try {
          const { id, login, name, email } = profile._json;
          const completeName = name.split(" ");
          const user = await Users.findOne({ email: email });
          const cart = await carts.addCart();
          const cartId = cart._id;
          if (!user) {
            const newUserInfo = {
              first_name: completeName[0],
              last_name: completeName[1],
              email: email,
              githubId: id,
              githubUsername: login,
              cartId: cartId,
            };

            const newUser = await Users.create(newUserInfo);
            return done(null, newUser);
          }

          return done(null, user);
        } catch (error) {
          logger.error("Error al inciar con github: ", error);
          done(error);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: tokenSecret,
      },
      (jwt_payload, done) => {
        try {
          done(null, jwt_payload);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = Users.findById(id);
    done(null, user);
  });
};

export { initializePassport };
