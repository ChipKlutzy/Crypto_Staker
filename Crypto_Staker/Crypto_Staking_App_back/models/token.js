const mongoose = require("mongoose");
const { Schema } = mongoose;

const tokenSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  decimals: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Token", tokenSchema);
