import { Messages } from "../../models/messages.model.js";

class chatDAO {
  async getMessages(user, message) {
    return await Messages.create({ user, message });
  }

  async getAllMessages() {
    return await Messages.find({}, { _id: 0, __v: 0 }).lean();
  }
}

export { chatDAO };
