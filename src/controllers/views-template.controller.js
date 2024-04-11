const { Router } = require("express");
const {
  recoveryPassword,
  changePassword,
} = require("../services/users.service");
const { validateToken } = require("../utils/recovery-jwt-util");

const router = Router();

router.get("/login", (req, res) => {
  res.render("login.handlebars");
});

router.get("/signup", (req, res) => {
  res.render("signup.handlebars");
});

router.get("/error-401", (req, res) => {
  console.log("Error 401");
  res.render("unauthorized-page.handlebars");
});

router.get("/loggerTest", (req, res) => {
  req.logger.info("Esto es un mensaje de tipo info");
  req.logger.error("Esto es un mensaje de tipo error");
  req.logger.warning("Esto es un mensaje de tipo warning");
  req.logger.debug("Esto es un mensaje de tipo debug");
  req.logger.fatal("Esto es un mensaje de tipo fatal");
  req.logger.http("Esto es un mensaje de tipo http");

  res.json({ message: "Testeo del logger finalizado" });
});

router.get("/passwordrecovery", (req, res) => {
  res.render("password-recovery.handlebars");
});

router.post("/passwordrecovery", (req, res) => {
  const email = req.body.email;
  req.logger.info(
    `Se ha solicitado un cambio de contraseña para el usuario ${email}`
  );
  const resetLink = recoveryPassword(email);
  res.redirect("/api/login");
});

router.get("/reset-password/:tkn", (req, res) => {
  const token = req.params.tkn;
  const isValid = validateToken(token);
  if (isValid) {
    const user = isValid.userInfo;
    const email = user.email;

    res.render("reset-password.handlebars", { email });
  } else {
    req.logger.error(isValid);
    res.render("unauthorized-page.handlebars");
  }
});

router.post("/update-password", async (req, res) => {
  try {
    const data = req.body;
    const { newPassword, email } = data;

    const resetPassword = await changePassword(newPassword, email);
    res.json({ message: "Contraseña actualizada" });
  } catch (error) {
    logger.error(error);
  }
});

router.get("/create/product", (req, res) => {
  res.render("add-product");
});

module.exports = router;
