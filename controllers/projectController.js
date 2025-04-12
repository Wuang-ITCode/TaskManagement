// controllers/projectController.js
const Project = require('../models/projectModels');

// Lấy tất cả dự án
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tạo mới dự án
exports.createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Cập nhật dự án
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Xóa dự án
exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa dự án" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
