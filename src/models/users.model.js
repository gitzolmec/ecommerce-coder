import mongoose from "mongoose";

const userCollection = "user";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  age: Number,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  role: {
    type: String,
    enum: ["user", "admin", "premium"],
    default: "user",
  },
  githubId: Number,
  githubUsername: String,
  gmailId: Number,
  facebookId: Number,
  cartId: mongoose.Schema.Types.ObjectId,
  purchase_history: [{ type: mongoose.Schema.Types.ObjectId, ref: "ticket" }],
  documents: [{ name: String, reference: String }],
  personal_documents: [{ name: String, status: Boolean }],
  status: Boolean,
  last_connection: Date,
});

const Users = mongoose.model(userCollection, userSchema);

export { Users };
