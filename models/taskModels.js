const mongoose = require('mongoose');
const AutoInscrement = require('mongoose-sequence')(mongoose);

const taskSchema = new mongoose.Schema({
  _id: Number,
  title: { type: String, required: true },
  userID: Number,
  description: String,
  members: Number,
  startDate: Date,
  endDate: Date,
  status: { type: String, default: "Chưa thực hiện" }
});

taskSchema.plugin(AutoInscrement, { id: 'task_counter', inc_field: '_id' });
module.exports = mongoose.model("Task", taskSchema);
