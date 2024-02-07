const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const privateMessageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  receiver: { type: Schema.Types.ObjectId, ref: "User" },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PrivateMessage", privateMessageSchema);
