import { UserDao } from "../DAO/Mongo/user-dao.mongo.js";
import { logger } from "../middlewares/logger.middleware.js";
import { formatDate } from "../utils/format-date.util.js";
import { totalQuantity } from "../utils/total-quantity.util.js";

const Users = new UserDao();
const getAllUsers = async () => {
  return await Users.getAllUsers();
};
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
  try {
    const user = await Users.getUserById(id);
    const documents = user.personal_documents;

    // Verificar si existen los tres documentos requeridos
    const hasDni = documents.some((doc) => doc.name === "dni");

    const hasAddressDoc = documents.some(
      (doc) => doc.name === "addressDocument"
    );

    const hasAccountDoc = documents.some(
      (doc) => doc.name === "accountDocument"
    );

    if (hasDni && hasAddressDoc && hasAccountDoc) {
      const role = user.role === "user" ? "premium" : "user";
      console.log("Rol actualizado correctamente");
      return await Users.updateRole(id, role);
    } else {
      console.log("Faltan documentos requeridos");
      return false;
    }
  } catch (error) {
    console.error("Error al actualizar el rol:", error);
  }
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

const logout = async (id) => {
  return await Users.logout(id);
};

const disableUsers = async () => {
  return await Users.disableUsers();
};
const enableusers = async (id) => {
  return await Users.enableUsers(id);
};

const addStatusToUsers = async () => {
  return await Users.addStatusToUsers();
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
  logout,
  getAllUsers,
  addStatusToUsers,
  disableUsers,
  enableusers,
};
