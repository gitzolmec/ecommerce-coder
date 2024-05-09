import { Router } from "express";
import { Users } from "../models/users.model.js";
import passport from "passport";
import { useValidPassword, createHash } from "../utils/crypt.password.util.js";
import { generateToken } from "../utils/jwt.util.js";
import passportCall from "../utils/passport-call.util.js";
import ms from "ms";
import { logout } from "../services/users.service.js";
const router = Router();

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/auth/fail-login" }),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      const token = generateToken({ id: user._id, role: user.role });

      const horaEnMilisegundos = ms("1h");
      req.logger.info("Sesion iniciada");
      res
        .cookie("authToken", token, {
          maxAge: horaEnMilisegundos,
          httpOnly: true,
        })
        .status(200)
        .json({
          message: "Login successful",
          user: token,
          redirectURL: "/api/products",
        });
    } catch (error) {
      req.logger.error(error);
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }
  }
);

router.get("/fail-login", (req, res) => {
  res.json({ status: "error", error: "Login failed" });
});

router.get("/logout", passportCall("jwt"), async (req, res) => {
  try {
    const userId = req.user.id;
    const userLogout = await logout(userId);
    req.logger.info("Sesión destruida");
    res.clearCookie("authToken").redirect("/api/login");
  } catch (error) {
    req.logger.error("Error al destruir la sesión:", error);
    res.json({ error: "Error al destruir la sesión" });
  }
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/login",
  }),
  async (req, res) => {
    const token = generateToken({ id: req.user._id, role: req.user.role });
    const ms = await import("ms");

    const horaEnMilisegundos = ms("1h");
    res
      .cookie("authToken", token, {
        maxAge: horaEnMilisegundos,
        httpOnly: true,
      })
      .redirect("/api/products");
  }
);

export default router;
