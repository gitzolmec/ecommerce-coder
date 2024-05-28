import { port } from "./src/configs/server.config.js";
import { Server } from "socket.io";
import { app } from "./src/server.js";
import { chatDAO } from "./src/DAO/Mongo/chat-dao.mongo.js";
import { cartDao } from "./src/DAO/Mongo/cart-dao.mongo.js";

import { logger } from "./src/middlewares/logger.middleware.js";
import { deleteProductByOwner } from "./src/services/product.service.js";
import {
  addProductToCart,
  deleteProductFromCart,
  updateProductQuantityInCart,
} from "./src/services/carts.service.js";
import { disableUsersCronJob } from "./src/configs/cron.config.js";

const chats = [];
const chat = new chatDAO();
const cart = new cartDao();
disableUsersCronJob();
const httpServer = app.listen(port, () => {
  logger.info(`Servidor escuchando en el puerto ${port}`);
});

const io = new Server(httpServer);
io.on("connection", (socket) => {
  socket.on("newUser", (data) => {
    socket.broadcast.emit("userConnected", data);

    socket.emit("messageLogs", chats);
  });

  socket.on("message", async (data) => {
    await chat.getMessages(data.username, data.message);

    const message = await chat.getAllMessages();

    io.emit("messageLogs", message);
  });

  socket.on("addProd", async ({ cartId, newProductId, quantity, tokenid }) => {
    cartId = cartId.trim();
    const view = "details";
    await addProductToCart(cartId, newProductId, quantity, tokenid, view);
  });
  socket.on(
    "addProdToView",
    async ({ cartId, newProductId, quantity, tokenid }) => {
      cartId = cartId.trim();
      const view = "details";
      await addProductToCart(cartId, newProductId, quantity, tokenid, view);
    }
  );

  socket.on("deleteProd", async ({ cartId, newProductId }) => {
    await deleteProductFromCart(cartId, newProductId);
  });
  socket.on(
    "deleteProductFromView",
    async ({ cartId, newProductId, quantity }) => {
      await updateProductQuantityInCart(cartId, newProductId, quantity);
    }
  );
  socket.on("deleteProduct", async ({ productId }) => {
    await deleteProductByOwner(productId);
  });
});

export { io };
