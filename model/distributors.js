const mongoose = require("mongoose");
const Scheme = mongoose.Schema;

const Distributors = new Scheme(
  {
    nameDis: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("distributor", Distributors);
