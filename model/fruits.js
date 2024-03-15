const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Fruits = new Schema(
  {
    name: { type: String },
    quantity: { type: Number },
    price: { type: Number },
    status: { type: Number },
    image: { type: Array },
    discriptions: { type: String },
    id_distributors: { type: Schema.Types.ObjectId, ref: "distributor" },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("fruit", Fruits);
