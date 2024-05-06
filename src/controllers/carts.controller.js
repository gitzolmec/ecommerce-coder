import { Router } from "express";
const router = Router();

import passportCall from "../utils/passport-call.util.js";

import {
  createTicket,
  addProductToCart,
  addCart,
  getCarts,
  getCartById,
  getCartUserInfo,
  getCartTotalQuantity,
  updateCartWithProductList,
  updateProductQuantityInCart,
  deleteProductFromCart,
  deleteCart,
  checkoutCart,
} from "../services/carts.service.js";
import { userAuthMiddleware } from "../middlewares/user-validation.middleware.js";

const errorHandler = (err, res) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
};

(async () => {
  router.get("/", passportCall("jwt"), async (req, res) => {
    try {
      const carts = await getCarts();
      res.json({ carts });
    } catch (err) {
      errorHandler(err, res);
    }
  });

  router.get("/:cid", passportCall("jwt"), async (req, res) => {
    try {
      const tokenId = req.user.id;

      const { userInfo, adminValidation } = await getCartUserInfo(tokenId);

      const { first_name, last_name, cartId, role } = userInfo;

      const cart = await getCartById(cartId);
      const totalProducts = await getCartTotalQuantity(cartId);

      if (cart) {
        const products = cart.products.map((p) => ({
          ...p.id,
          quantity: p.quantity,
        }));

        req.logger.debug(adminValidation);
        res.render("cart.handlebars", {
          products,
          cartId,
          first_name,
          last_name,
          totalProducts,
          adminValidation,
          role,
          tokenId,
        });
      } else {
        res.status(404).json({ error: "Carrito no encontrado" });
        req.logger.error("Carrito no encontrado");
      }
    } catch (err) {
      errorHandler(err, res);
    }
  });

  router.post(
    "/:cid/products/:pid",
    passportCall("jwt"),
    userAuthMiddleware,
    async (req, res) => {
      try {
        const pid = req.params.pid;
        const cid = req.params.cid;
        const addProduct = { cartId: cid, productId: pid };

        const { cartId, productId, quantity } = await addProductToCart(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          addProduct
        );

        res.json({
          message: `Producto con ID ${productId} agregado al carrito ${cartId}, unidades agregadas: ${quantity}`,
        });
      } catch (err) {
        req.logger.error("Error al agregar el producto al carrito", err);
      }
    }
  );

  router.put("/:cid", async (req, res) => {
    try {
      const cartId = req.params.cid;
      const productsList = req.body;

      await updateCartWithProductList(cartId, productsList);

      res.json({
        message: `Carrito con ID ${cartId} actualizado con éxito.`,
      });
    } catch (err) {
      errorHandler(err, res);
    }
  });

  router.put("/:cid/products/:pid", async (req, res) => {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const quantity = req.body.quantity;

      await updateProductQuantityInCart(cartId, productId, quantity);

      res.json({
        message: `Carrito con ID ${cartId} actualizado con éxito.`,
      });
    } catch (err) {
      errorHandler(err, res);
    }
  });

  router.delete("/:cid/products/:pid", async (req, res) => {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;

      const deletedProduct = await deleteProductFromCart(cartId, productId);

      res.json({
        message: `Producto con ID ${productId} eliminado con éxito del carrito ${cartId}.`,
        deletedProduct,
      });
    } catch (err) {
      req.logger.error("Error al eliminar el producto del carrito", err);
    }
  });

  router.delete("/:cid", async (req, res) => {
    try {
      const cartId = req.params.cid;

      const deleted = await deleteCart(cartId);

      res.json({
        message: `Carrito con ID ${cartId} vaciado con éxito.`,
      });
    } catch (err) {
      errorHandler(err, res);
    }
  });

  router.get("/:cid/purchase", passportCall("jwt"), async (req, res) => {
    try {
      const cartId = req.params.cid;
      const { totalprice, purchaseDetails, stock } = await checkoutCart(cartId);

      if (stock === false) {
        req.logger.warning("No hay stock suficiente");
        setTimeout(() => {
          res.redirect("/api/products");
        }, 5000);

        return;
      }

      const ticket = await createTicket(req, totalprice, purchaseDetails);
      res.redirect("/api/products");
    } catch (err) {
      req.logger.error("Error al completar la compra", err);
      errorHandler(err, res);
    }
  });
})();

export { router };
