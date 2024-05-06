import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const cartCollection = "cart";

const cartSchema = new mongoose.Schema({
  products: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "products" },

      quantity: { type: Number },
    },
  ],
});
cartSchema.plugin(mongoosePaginate);
const Carts = mongoose.model(cartCollection, cartSchema);

export { Carts };
