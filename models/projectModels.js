// models/Project.js
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  type: String,
  startDate: Date,
  endDate: Date,
  status: { type: String, default: "Chưa thực hiện" }, // Có thể là: Chưa thực hiện, Đang thực hiện, Đã hoàn thành
});

module.exports = mongoose.model("Project", projectSchema);
