import { Router } from "express";
import { userAuthMiddleware } from "../middlewares/user-validation.middleware.js";
import passportCall from "../utils/passport-call.util.js";

const router = Router();

router.get("/", passportCall("jwt"), userAuthMiddleware, async (req, res) => {
  res.render("chat.handlebars");
});

export { router };
