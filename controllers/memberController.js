const Member = require('../models/memberModel');
const MemberProject = require('../models/MemberProjectModel');

// Lấy tất cả thành viên
exports.getAllMembers = async (req, res) => {
    try {
        const members = await Member.find();
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy thành viên theo ID
exports.getMemberById = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Không tìm thấy thành viên' });
        }
        res.json(member);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo thành viên mới
exports.createMember = async (req, res) => {
    try {
        const member = new Member(req.body);
        const newMember = await member.save();
        const memberProject = new MemberProject({ memberID: newMember._id, projectID: req.body.projectID })
        await memberProject.save();
        
        res.status(201).json(newMember);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cập nhật thành viên
exports.updateMember = async (req, res) => {
    try {
        const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!member) {
            return res.status(404).json({ message: 'Không tìm thấy thành viên' });
        }
        res.json(member);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa thành viên
exports.deleteMember = async (req, res) => {
    try {
        const member = await Member.findByIdAndDelete(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Không tìm thấy thành viên' });
        }
        res.json({ message: 'Đã xóa thành viên thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 