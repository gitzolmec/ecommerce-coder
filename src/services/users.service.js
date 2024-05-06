import { UserDao } from "../DAO/Mongo/user-dao.mongo.js";
import { logger } from "../middlewares/logger.middleware.js";
import { formatDate } from "../utils/format-date.util.js";
import { totalQuantity } from "../utils/total-quantity.util.js";

const Users = new UserDao();

const getUserById = async (tokenId) => {
  return await Users.getUserById(tokenId);
};
const getOwnerInfo = async (email) => {
  return await Users.getOwnerInfo(email);
};

const updateUser = async (id, data) => {
  return await Users.updateUser(id, data);
};
const updateUserRole = async (id) => {
  const user = await Users.getUserById(id);
  const role = user.role === "user" ? "premium" : "user";
  return await Users.updateRole(id, role);
};

const getPurchases = async (req) => {
  const tokenid = req.user.id;

  const userId = await getUserById(tokenid);

  const id = userId._id;
  const { role, first_name, last_name, cartId } = userId;

  const quantity = await totalQuantity(cartId);
  const purchaseHistory = await Users.getPurchases(id);

  purchaseHistory.forEach((element) => {
    const defaultDate = element.purchase_datetime;

    const date = formatDate(defaultDate);
    element.purchase_datetime = date;
  });

  return { purchaseHistory, role, first_name, last_name, quantity, cartId };
};

const deleteUser = async (id) => {
  return await Users.deleteUser(id);
};

const getUserListForAdmins = async () => {
  return await Users.getUserListForAdmins();
};

const recoveryPassword = async (email) => {
  return await Users.sendRecoverPasswordLink(email);
};

const changePassword = async (newPassword, email) => {
  return await Users.changePassword(newPassword, email);
};

export {
  getUserById,
  updateUser,
  getPurchases,
  deleteUser,
  getUserListForAdmins,
  recoveryPassword,
  changePassword,
  getOwnerInfo,
  updateUserRole,
};
