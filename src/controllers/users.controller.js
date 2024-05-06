import { Router } from "express";

import { adminAuthMiddleware } from "../middlewares/admin-validation.middleware.js";
const router = Router();
import passport from "passport";
import passportCall from "../utils/passport-call.util.js";
import {
  getUserById,
  getPurchases,
  getUserListForAdmins,
  updateUserRole,
} from "../services/users.service.js";
import { totalQuantity } from "../utils/total-quantity.util.js";
import { UserResponseDto } from "../DTO/user-info.js";
import { adminValidation } from "../utils/admin-validation.util.js";

router.post(
  "/",
  passport.authenticate("register", {
    failureRedirect: "/users/fail-register",
  }),
  async (req, res) => {
    try {
      const redirectURL = "/api/login";

      res.json({ status: "success", redirectURL });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: "success", message: "Internal Server Error" });
    }
  }
);

router.get(
  "/list",

  passportCall("jwt"),
  adminAuthMiddleware,
  async (req, res) => {
    try {
      const tokenid = req.user.id;
      const userInfo = await getUserById(tokenid);
      const userInfoDto = new UserResponseDto(userInfo);
      const list = await getUserListForAdmins();

      res.render("users-list.handlebars", { list, userInfoDto });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }
  }
);

router.get("/fail-register", (req, res) => {
  req.logger.error("Error al registrar usuario");
  res.status(400).json({ status: "error", error: "Bad request" });
});

router.get("/current", passportCall("jwt"), async (req, res) => {
  try {
    const tokenid = req.user.id;
    const userInfo = await getUserById(tokenid);
    const userInfoDto = new UserResponseDto(userInfo);
    const totalProducts = await totalQuantity(userInfoDto.cartId);
    const userValidation = adminValidation(userInfoDto.role);

    res.render("user-detail.handlebars", {
      userInfoDto,
      userValidation,
      totalProducts,
    });
  } catch (error) {
    req.logger.error(error);
    res.status(400).json({ status: "error", message: "Not Found" });
  }
});

router.get("/purchaseHistory", passportCall("jwt"), async (req, res) => {
  try {
    const { purchaseHistory, role, first_name, last_name, quantity, cartId } =
      await getPurchases(req);
    const tokenid = req.user.id;
    const userInfo = await getUserById(tokenid);
    const userInfoDto = new UserResponseDto(userInfo);
    const totalProducts = await totalQuantity(userInfoDto.cartId);
    const userValidation = adminValidation(userInfoDto.role);
    res.render("purchase-history.handlebars", {
      purchaseHistory,
      role,
      first_name,
      last_name,
      quantity,
      cartId,
      userValidation,
      totalProducts,
    });
  } catch (error) {
    req.logger.error(error);
    res.status(400).json({ status: "error", message: "Not Found" });
  }
});

router.get("/premium/:uid", async (req, res) => {
  try {
    const tokenid = req.params.uid;
    const updateRole = updateUserRole(tokenid);
    res.redirect("/api/users/current");
  } catch (error) {
    req.logger.error(error);
    res.status(400).json({ status: "error", message: "Not Found" });
  }
});
export { router };
