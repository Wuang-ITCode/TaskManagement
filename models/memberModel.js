const mongoose = require('mongoose');
const AutoInscrement = require('mongoose-sequence')(mongoose);
const memberSchema = new mongoose.Schema({
    _id: Number,
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
        enum: ['Quản trị viên', 'Thành viên'],
        default: 'Thành viên'
    }
}, {
    timestamps: true
});
memberSchema.plugin(AutoInscrement, { id: 'member_counter', inc_field: '_id' });
const Member = mongoose.model('Member', memberSchema);

module.exports = Member; 