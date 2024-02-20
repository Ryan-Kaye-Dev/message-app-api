const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  message: { type: String, required: true },
  chatroom: { type: Schema.Types.ObjectId, ref: "Chatroom" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
