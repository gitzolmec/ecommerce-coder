const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const productCollection = "products";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  code: {
    type: String,
    unique: true,
    required: true,
  },
  stock: { type: Number, required: true },
  status: { type: Boolean, default: true, required: true },
  category: { type: String, required: true },
  owner: { type: String, ref: "user", required: true, default: "admin" },
});
productSchema.plugin(mongoosePaginate);
const Products = mongoose.model(productCollection, productSchema);

module.exports = Products;
