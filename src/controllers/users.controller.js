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
  getAllUsers,
  addStatusToUsers,
} from "../services/users.service.js";
import { totalQuantity } from "../utils/total-quantity.util.js";
import { UserResponseDto } from "../DTO/user-info.js";
import { adminValidation } from "../utils/admin-validation.util.js";
import upload from "../middlewares/multer.middleware.js";
import uploadFiles from "../middlewares/upload.middleware.js";

router.get("/", passportCall("jwt"), async (req, res) => {
  try {
    const users = await getAllUsers();

    res.json({ users });
  } catch (error) {
    req.logger.error(error);
    res
      .status(500)
      .json({ status: "success", message: "Internal Server Error" });
  }
});

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
      req.logger.error(error);
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
      req.logger.error(error);
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
      tokenid,
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
      tokenid,
    });
  } catch (error) {
    req.logger.error(error);
    res.status(400).json({ status: "error", message: "Not Found" });
  }
});

router.get("/premium/:uid", passportCall("jwt"), async (req, res) => {
  try {
    const tokenid = req.params.uid;
    const updateRole = await updateUserRole(tokenid);

    if (updateRole == false) {
      const withoutdocumentlink = `/api/users/${tokenid}/documents`;

      res.render("without-documents", { withoutdocumentlink });
    } else {
      res.render("change-role");
    }
  } catch (error) {
    req.logger.error(error);
    res.status(400).json({ status: "error", message: "Not Found" });
  }
});

router.get("/:uid/documents", passportCall("jwt"), async (req, res) => {
  const tokenid = req.user.id;
  const userInfo = await getUserById(tokenid);
  const userInfoDto = new UserResponseDto(userInfo);
  const totalProducts = await totalQuantity(userInfoDto.cartId);
  const userValidation = adminValidation(userInfoDto.role);
  const cartId = userInfoDto.cartId;
  res.render("upload-files.handlebars", {
    userInfoDto,
    totalProducts,
    userValidation,
    tokenid,
    cartId,
  });
});

router.post(
  "/:uid/documents",
  passportCall("jwt"),
  upload.single("myFile"),
  uploadFiles,
  (req, res) => {
    // Aquí manejar la subida del archivo (esencialmente lo que ya tengas hecho)
    res.json({ message: "Archivo cargado con éxito" });
  }
);

export { router };
