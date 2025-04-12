const Task = require('../models/taskModels');

exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        console.error('Error getting tasks:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách công việc' });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Không tìm thấy công việc' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createTask = async (req, res) => {
    try {
        const taskData = {
            title: req.body.title,
            userID: req.body.userID,
            description: req.body.description,
            members: req.body.members,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            status: req.body.status
        };

        const newTask = new Task(taskData);
        console.log(newTask);
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error creating task:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Dữ liệu không hợp lệ',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({ message: 'Lỗi khi tạo công việc mới' });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const taskData = {
            title: req.body.title,
            userID: req.body.userID,
            description: req.body.description,
            members: req.body.members,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            status: req.body.status
        };

        const updated = await Task.findByIdAndUpdate(
            req.params.id, 
            taskData, 
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Không tìm thấy công việc' });
        }

        res.json(updated);
    } catch (error) {
        console.error('Error updating task:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Dữ liệu không hợp lệ',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({ message: 'Lỗi khi cập nhật công việc' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const deleted = await Task.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Không tìm thấy công việc' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Lỗi khi xóa công việc' });
    }
};
