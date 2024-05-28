import { cartDao } from "../DAO/Mongo/cart-dao.mongo.js";
import { v4 as uuidv4 } from "uuid";
import { getUserById, updateUser } from "./users.service.js";
import { transporter } from "../utils/nodemailer.util.js";
import { logger } from "../middlewares/logger.middleware.js";
import { getProductById } from "./product.service.js";
import { totalQuantity } from "../utils/total-quantity.util.js";
import { CART_ERRORS } from "../handlers/errors/cart-error-types.js";
import { addingOwnProduct } from "../handlers/errors/generate-error-info.js";
import { CustomError } from "../handlers/errors/custom.error.js";
import { EErrors } from "../handlers/errors/enum.error.js";
import { io } from "../../app.js";
import totalPrice from "../utils/total-price.util.js";

const cart = new cartDao();

const getCartById = async (id) => {
  const thisCart = await cart.getCartById(id);

  return thisCart;
};

const getCarts = async () => {
  const carts = await cart.getCarts();
  return carts;
};
const addCart = async () => {
  const newCart = await cart.addCart();
  return newCart;
};

const getCartUserInfo = async (id) => {
  const userInfo = await getUserById(id);
  const { role } = userInfo;
  let adminValidation = "";
  if (role == "admin") {
    adminValidation = "admin";
  } else if (role == "premium") {
    adminValidation = "premium";
  } else {
    adminValidation = "user";
  }

  return { userInfo, adminValidation };
};

const getCartTotalQuantity = async (cartId) => {
  const totalQuantity = await cart.totalQuantity(cartId);
  return totalQuantity;
};

const deleteProductFromCart = async (cartId, productId) => {
  const userCart = await cart.deleteProductFromCart(cartId, productId);
  return userCart;
};

const deleteCart = async (cartId) => {
  const cart = await cart.deleteCart(cartId);
  return cart;
};

const checkoutCart = async (cartId) => {
  const checkoutInfo = await cart.checkoutCart(cartId);
  return checkoutInfo;
};
const createTicket = async (req, totalprice, purchaseDetails) => {
  const tokenid = req.user.id;

  const userInfo = await getUserById(tokenid);
  const { email, first_name, last_name } = userInfo;
  const userId = userInfo._id;
  const amount = totalprice;
  const code = uuidv4();
  const purchaser = email;
  const ticket = await cart.createTicket(
    purchaser,
    code,
    amount,
    purchaseDetails
  );
  const purchaseId = ticket._id;
  await updateUser(userId, purchaseId);
  sendEmail(first_name, last_name, email, purchaseDetails, amount);
  return ticket;
};

const updateCartWithProductList = async (cartId, productList) => {
  const UpdatedCart = await cart.updateCartWithProductList(cartId, productList);
  return UpdatedCart;
};

const updateProductQuantityInCart = async (cartId, productId, quantity) => {
  const updateCart = await cart.updateProductQuantityInCart(
    cartId,
    productId,
    quantity
  );
  const totalProducts = await totalQuantity(cartId);
  logger.info(totalProducts);
  const cartWithoutDetails = await getCartById(cartId);
  const cartWithDetails = cartWithoutDetails.products.map((p) => ({
    ...p.id,
    quantity: p.quantity,
  }));
  const total = totalPrice(cartWithDetails);
  io.emit("oneProductDeleted", updateCart, totalProducts, total);
  return updateCart;
};

const addProductToCart = async (
  cartId,
  productId,
  quantity,
  tokenid,
  view,
  addProduct
) => {
  try {
    if (!addProduct) {
      const product = await getProductById(productId);
      const productOwner = product.owner;
      const loggedUser = await getUserById(tokenid);
      const emailUser = loggedUser.email;
      if (productOwner === emailUser) {
        return CustomError.createError({
          name: CART_ERRORS.ERROR_ADDING_PRODUCT,
          cause: addingOwnProduct(),
          message:
            "no se puede agregar productos donde el usuario sea el owner a su carrito",
          code: EErrors.BAD_REQUEST,
        });
      }
      const Cart = await cart.addProductToCart(cartId, productId, quantity);
      const totalProducts = await totalQuantity(cartId);
      const cartWithoutDetails = await getCartById(cartId);
      const cartWithDetails = cartWithoutDetails.products.map((p) => ({
        ...p.id,
        quantity: p.quantity,
      }));
      const total = totalPrice(cartWithDetails);

      io.emit("cartUpdated", Cart, totalProducts, total, view);
      return Cart;
    } else {
      const cartId = addProduct.cartId;
      const productId = addProduct.productId;
      const quantity = 1;
      const Cart = await cart.addProductToCart(cartId, productId, quantity);
      return cartId, productId, quantity;
    }
  } catch (error) {
    console.error("Error en addProductToCart:", error);

    if (error instanceof CustomError) {
      throw error;
    }
  }
};

const sendEmail = async (
  first_name,
  last_name,
  email,
  purchaseDetails,
  amount
) => {
  const content = purchaseDetails
    .map(
      (data) =>
        `<tr><td>${data.quantity}</td><td>${data.title}</td><td>${data.price}</td></tr>`
    )
    .join("");
  const message = `<style>
  table, th, td {
    border: 1px solid  ;
    border-collapse: collapse;
    
    text-align: center;
    align-items: center;
  }

  .tableEmail{
    width: 100%;
  }

  .total{
    font-weight: bold;
    text-align: right;
    margin-right: 10px;
  }
</style><table class="tableEmail" ><tr><th>Cantidad</th><th>Producto</th><th>Precio</th></tr>${content}<tr><td>TOTAL:</td><td colspan="2" class="total"> ${amount}</td></tr></table>`;
  const MailInfo = await transporter.sendMail({
    from: '"8-bits 🎮" <jorgemorales.600@gmail.com>',
    to: email,
    subject: "Compra Exitosa ✔",
    text: `Hola ${first_name} ${last_name}`,
    html: message,
  });

  logger.info(`Message sent: %s, ${MailInfo.messageId}`);
};

export {
  createTicket,
  checkoutCart,
  getCartById,
  addProductToCart,
  addCart,
  getCarts,
  getCartUserInfo,
  getCartTotalQuantity,
  updateCartWithProductList,
  updateProductQuantityInCart,
  deleteProductFromCart,
  deleteCart,
};
