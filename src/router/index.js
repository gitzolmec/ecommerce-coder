import {
  serve as swaggerServe,
  setup as swaggerSetup,
} from "swagger-ui-express";
import { router as productController } from "../controllers/products.controller.js";
import { router as cartController } from "../controllers/carts.controller.js";
import { router as chatController } from "../controllers/chat.controller.js";
import authController from "../controllers/auth.controller.js";
import { router as usersController } from "../controllers/users.controller.js";
import { router as viewsTemplateController } from "../controllers/views-template.controller.js";
import { router as testController } from "../test/controller/product-test.controller.js";
import { specs } from "../utils/swagger/options.swagger.js";

const router = (app) => {
  app.use("/api", viewsTemplateController);
  app.use("/api/products", productController);
  app.use("/api/carts", cartController);
  app.use("/api/chat", chatController);
  app.use("/api/auth", authController);
  app.use("/api/users", usersController);
  app.use("/api/test", testController);
  app.use("/api/docs", swaggerServe, swaggerSetup(specs));
};

export { router };
