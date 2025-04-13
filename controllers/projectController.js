// controllers/projectController.js
const Project = require('../models/projectModels');
const Member = require('../models/memberModel');
const MemberProject = require('../models/MemberProjectModel');
const User = require('../models/user');

// Lấy tất cả dự án
exports.getAllProjects = async (req, res) => {
  try {    
    const user_id = Number(req.query.user);
    const projects = await Project.find({ userID: user_id });
    const allProjectsMap = new Map();
    // Thêm các project do user tạo
    projects.forEach(p => allProjectsMap.set(p._id.toString(), p));

    const user = await User.find({ _id: user_id });
    const findMember = await Member.find({ email: user[0].email });
    if (findMember.length > 0) {
      const projectIdsFromMembership = await MemberProject.find({ memberID: findMember[0]._id });
      const projectIds = projectIdsFromMembership.map(mp => mp.projectID);
      const projectMores = await Project.find({ _id: { $in: projectIds } });
      // Thêm các project từ membership
      projectMores.forEach(p => allProjectsMap.set(p._id.toString(), p));
    }
  
    // Chuyển map thành mảng
    const allProjects = Array.from(allProjectsMap.values());

    res.json(allProjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
        return res.status(404).json({ message: 'Không tìm thấy công việc' });
    }
    res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo mới dự án
exports.createProject = async (req, res) => {
  try {

    const { name, description, type, startDate, endDate, status } = req.body;
    const userID = req.body.userID; // req.user nếu đã có middleware xác thực
    if (!userID) return res.status(400).json({ error: 'Thiếu user_id' });
    const project = new Project({
      name,
      description,
      userID,
      type,
      startDate,
      endDate,
      status,
    });

    await project.save();

    const memberProject = new MemberProject({ memberID: userID, projectID: project._id })
    await memberProject.save();
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
