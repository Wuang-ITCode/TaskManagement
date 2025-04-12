// models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "Thành viên" } // hoặc "Quản trị viên"
});

module.exports = mongoose.model("User", userSchema);
