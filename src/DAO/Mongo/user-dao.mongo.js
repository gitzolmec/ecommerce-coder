import { logger } from "../../middlewares/logger.middleware.js";
import { Users } from "../../models/users.model.js";
import {
  createHash,
  useValidPassword,
} from "../../utils/crypt.password.util.js";
import { formatDate } from "../../utils/format-date.util.js";
import { transporter } from "../../utils/nodemailer.util.js";
import { generateRecoveryToken } from "../../utils/recovery-jwt-util.js";

class UserDao {
  async getAllUsers() {
    return await Users.find();
  }
  async getUserById(id) {
    return await Users.findById(id);
  }
  async updateUser(id, purchaseId) {
    return await Users.findByIdAndUpdate(id, {
      $push: { purchase_history: purchaseId },
    });
  }
  async updateUserDocuments(id, newDocument) {
    return await Users.findByIdAndUpdate(
      id,
      { $push: { documents: newDocument } },
      { new: true }
    );
  }
  async updateRole(id, role) {
    return await Users.findByIdAndUpdate(id, { role: role });
  }

  async getOwnerInfo(email) {
    return await Users.findOne({ email: email });
  }

  async getPurchases(id) {
    const purchases = await Users.findById(id)
      .populate("purchase_history")
      .lean();

    const purchaseHistory = purchases.purchase_history;

    const details = purchaseHistory.map((item) => item.details);

    purchaseHistory.forEach((item) => {
      item.details = item.details.map((detail) => detail.title);
    });

    return purchaseHistory;
  }

  async deleteUser(id) {
    return await Users.findByIdAndDelete(id);
  }

  async getUserListForAdmins() {
    const list = [];
    const user = await Users.find({}, { __v: 0 });
    user.forEach((users) => {
      const first_name = users.first_name;
      const last_name = users.last_name;
      const email = users.email;
      const role = users.role;
      list.push({ first_name, last_name, email, role });
    });

    return list;
  }
  async sendRecoverPasswordLink(email) {
    const user = await Users.findOne({ email: email });
    const { first_name, last_name, _id } = user;
    const userInfo = { email, _id };
    const recoveryToken = await generateRecoveryToken({ userInfo });

    const resetLink = `http://localhost:8080/api/reset-password/${recoveryToken}`;
    const message = `este es tu link de recuperacion de clave: <a href=${resetLink}>${resetLink}</a>`;
    const MailInfo = await transporter.sendMail({
      from: '"8-bits 🎮" <jorgemorales.600@gmail.com>',
      to: email,
      subject: "Recuperacion de contraseña",
      text: `Hola ${first_name} ${last_name}`,
      html: message,
    });
    logger.info(`Message sent: %s, ${MailInfo.messageId}`);
  }

  async changePassword(newPassword, email) {
    const userInfo = await Users.findOne({ email: email });
    const validPassword = useValidPassword(userInfo, newPassword);
    if (!validPassword) {
      const user = await Users.findOneAndUpdate(
        { email: email },
        { password: createHash(newPassword) }
      );

      return user;
    }
    logger.warning("La contraseña ya existe");
  }

  async logout(id) {
    return await Users.findByIdAndUpdate(id, {
      last_connection: formatDate(Date.now()),
    });
  }

  async addStatusToUsers() {
    try {
      const result = await Users.updateMany({}, { $set: { status: true } });
      const users = await Users.find();
      logger.info(
        `${users} usuarios actualizados correctamente con la propiedad 'status'.`
      );
      return result;
    } catch (error) {
      logger.error(
        "Error al agregar la propiedad 'status' a los usuarios:",
        error
      );
      throw error;
    }
  }

  async disableUsers() {
    try {
      const mediaHoraAtras = new Date(Date.now() - 30 * 60 * 1000);
      const userList = await Users.find();
      const result = await Users.updateMany(
        {
          last_connection: { $lt: mediaHoraAtras },
          role: { $ne: "admin" },
        },
        { $set: { status: false } }
      );
      const disabledUsers = await Users.find({ status: false });

      disabledUsers.forEach(async (user) => {
        const { first_name, last_name, email, _id } = user;
        const userInfo = { email, _id };
        const enableAccountToken = await generateRecoveryToken({ userInfo });
        const enableAccountLink = `http://localhost:8080/api/enableaccount/${enableAccountToken}`;
        const message = `Su cuenta ha sido deshabilitada por inactividad, para reactivar su cuenta siga el siguiente link: <a href=${enableAccountLink}>Link de reactivacion</a>`;
        const originalUser = userList.find((users) => users.id === user.id);
        if (user.status !== originalUser.status) {
          try {
            const MailInfo = await transporter.sendMail({
              from: '"8-bits 🎮" <jorgemorales.600@gmail.com>',
              to: email,
              subject: "Cuenta Deshabilitada por inactividad",
              text: `Hola ${first_name} ${last_name}`,
              html: message,
            });
            logger.info(
              "eliminando usuarios inactivos y enviando correo de notificacion......"
            );
            console.log(
              `Correo electrónico enviado a ${email}: ${MailInfo.messageId}`
            );
          } catch (error) {
            console.error(
              `Error al enviar correo electrónico a ${email}:`,
              error
            );
          }
        }
      });

      return result;
    } catch (error) {
      logger.error("Error al deshabilitar usuarios:", error);
      throw error;
    }
  }

  async enableUsers(id) {
    return await Users.findByIdAndUpdate(id, { status: true });
  }
}

export { UserDao };
