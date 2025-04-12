const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên thành viên là bắt buộc'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email là bắt buộc'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ']
    },
    role: {
        type: String,
        required: [true, 'Vai trò là bắt buộc'],
        enum: ['Admin', 'Member', 'Leader'],
        default: 'Member'
    }
}, {
    timestamps: true
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member; 