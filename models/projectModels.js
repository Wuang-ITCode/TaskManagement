// models/Project.js
const mongoose = require("mongoose");
const AutoInscrement = require('mongoose-sequence')(mongoose);

const projectSchema = new mongoose.Schema({
  _id: Number,
  name: { type: String, required: true },
  description: String,
  type: String,
  startDate: Date,
  endDate: Date,
  status: { type: String, default: "Chưa thực hiện" }, // Có thể là: Chưa thực hiện, Đang thực hiện, Đã hoàn thành
});

projectSchema.plugin(AutoInscrement, { id: 'project_counter', inc_field: '_id' });
module.exports = mongoose.model("Project", projectSchema);
