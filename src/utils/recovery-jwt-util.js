import jwt from "jsonwebtoken";
import { tokenSecret } from "../configs/token.config.js";

const generateRecoveryToken = (userInfo) => {
  return jwt.sign(userInfo, tokenSecret, { expiresIn: "1h" });
};

const validateToken = (token) => {
  try {
    const decoded = jwt.verify(token, tokenSecret);
    return decoded;
  } catch (error) {
    // Si hay un error en la verificación del token, como la expiración o un token inválido, se lanza una excepción
    return null;
  }
};

export { generateRecoveryToken, validateToken };
