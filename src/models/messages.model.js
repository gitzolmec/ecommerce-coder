import mongoose from "mongoose";

const messagesCollection = "messages";

const messageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  message: { type: String, required: true },
});

const Messages = mongoose.model(messagesCollection, messageSchema);

export { Messages };
