const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
    try {
        // Lấy token từ header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Không tìm thấy token' });
        }

        // Xác thực token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Tìm user theo id từ token
        const user = await User.findOne({ _id: decoded.id, isActive: true });
        
        if (!user) {
            return res.status(401).json({ message: 'Người dùng không tồn tại hoặc đã bị vô hiệu hóa' });
        }

        // Lưu user vào request để sử dụng ở các middleware tiếp theo
        req.user = user;
        req.token = token;
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token đã hết hạn' });
        }
        return res.status(401).json({ message: 'Token không hợp lệ' });
    }
};

module.exports = authMiddleware; 