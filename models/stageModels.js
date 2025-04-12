const mongoose = require('mongoose');
const AutoInscrement = require('mongoose-sequence')(mongoose);

const stageSchema = new mongoose.Schema({
  _id: Number,
  name: { type: String, required: true },
  projectID: Number,
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, default: 'Chưa bắt đầu' }
});

stageSchema.plugin(AutoInscrement, { id: 'stage_counter', inc_field: '_id' });
module.exports = mongoose.model('Stage', stageSchema);
