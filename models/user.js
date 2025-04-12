const mongoose = require('mongoose');

// Xóa model cũ nếu tồn tại
if (mongoose.models.User) {
    delete mongoose.models.User;
}

const userSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: [true, 'Họ và tên là bắt buộc'],
    trim: true,
    minlength: [2, 'Họ và tên phải có ít nhất 2 ký tự']
  },
  email: { 
    type: String, 
    required: [true, 'Email là bắt buộc'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Email không hợp lệ']
  },
  password: { 
    type: String, 
    required: [true, 'Mật khẩu là bắt buộc'],
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // Tự động thêm createdAt và updatedAt
});

module.exports = mongoose.model('User', userSchema);
