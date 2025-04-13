// controllers/userController.js
const user = require('../models/user');

// Lấy tất cả người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await user.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Thêm người dùng
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Sửa người dùng
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Xóa người dùng
exports.deleteUser = async (req, res) => {
  try {
    await user.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa người dùng" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
