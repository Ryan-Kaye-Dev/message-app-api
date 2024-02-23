const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  message: { type: String, required: true },
  chatroom: { type: Schema.Types.ObjectId, ref: "Chatroom" },
  date: { type: Date, default: Date.now },
});

// Define a virtual for formatted date and time
messageSchema.virtual("formattedDateTime").get(function () {
  const options = { hour: "2-digit", minute: "2-digit" };
  return `${this.date.toLocaleDateString()} ${this.date.toLocaleTimeString([], options)}`;
});

module.exports = mongoose.model("Message", messageSchema);
