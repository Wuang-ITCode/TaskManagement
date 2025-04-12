const Stage = require('../models/stageModels');

// Lấy tất cả stage
exports.getAllStages = async (req, res) => {
  try {
    const project_id = req.query.project_id;
    const stages = await Stage.find({ projectID: project_id });
    res.json(stages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStageById = async (req, res) => {
  try {
    const stage = await Stage.findById(req.params.id);
    if (!stage) {
        return res.status(404).json({ message: 'Không tìm thấy công việc' });
    }
    res.json(stage);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
