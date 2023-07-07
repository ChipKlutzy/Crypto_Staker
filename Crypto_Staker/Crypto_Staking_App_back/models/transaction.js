const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema({
  hash: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  nonce: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
