const mongoose = require('mongoose');

const stageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['Chưa bắt đầu', 'Đang thực hiện', 'Đã hoàn thành'], default: 'Chưa bắt đầu' }
});

module.exports = mongoose.model('Stage', stageSchema);
