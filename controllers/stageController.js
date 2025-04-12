const Stage = require('../models/stageModels');

// Lấy tất cả stage
exports.getAllStages = async (req, res) => {
  try {
    const stages = await Stage.find();
    res.json(stages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tạo stage mới
exports.createStage = async (req, res) => {
  try {
    const newStage = new Stage(req.body);
    await newStage.save();
    res.status(201).json(newStage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Cập nhật stage
exports.updateStage = async (req, res) => {
  try {
    const updated = await Stage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Xóa stage
exports.deleteStage = async (req, res) => {
  try {
    await Stage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xóa thành công' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
