import { logger } from "../middlewares/logger.middleware.js";
import { Carts } from "../models/carts.model.js";
async function totalQuantity(cartId) {
  try {
    const cart = await Carts.findOne({ _id: cartId });
    if (!cart) {
      logger.warning("Carrito no encontrado");
      throw new Error("Carrito no encontrado");
    }
    const currentCart = cart.products;
    let quantity = 0;

    currentCart.forEach((product) => {
      quantity += product.quantity;
    });

    return quantity;
  } catch (err) {
    logger.error(err);
  }
  return 0; //
}
export { totalQuantity };
