const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  userID: String,
  description: String,
  members: Number,
  startDate: Date,
  endDate: Date,
  status: { type: String, default: "Chưa thực hiện" }
});

module.exports = mongoose.model("Task", taskSchema);
