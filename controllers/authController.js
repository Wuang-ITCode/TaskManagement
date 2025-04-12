const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Đăng ký người dùng mới
const register = async (req, res) => {
    try {
        console.log('Received registration data:', req.body);
        const { fullName, email, password } = req.body;

        // Validate dữ liệu đầu vào
        const errors = [];
        
        if (!fullName) {
            errors.push('Họ và tên là bắt buộc');
        } else if (fullName.length < 2) {
            errors.push('Họ và tên phải có ít nhất 2 ký tự');
        }

        if (!email) {
            errors.push('Email là bắt buộc');
        } else if (!email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
            errors.push('Email không hợp lệ');
        }

        if (!password) {
            errors.push('Mật khẩu là bắt buộc');
        } else if (password.length < 6) {
            errors.push('Mật khẩu phải có ít nhất 6 ký tự');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Dữ liệu không hợp lệ',
                errors: errors
            });
        }

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'Email đã được sử dụng',
                errors: ['Email đã được sử dụng']
            });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user mới
        const user = new User({
            fullName: fullName.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        const savedUser = await user.save();
        console.log('User saved successfully:', savedUser);

        // Tạo token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'your_jwt_secret_key_here',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Dữ liệu không hợp lệ',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({ 
            message: 'Lỗi server',
            errors: ['Có lỗi xảy ra, vui lòng thử lại sau']
        });
    }
};

// Đăng nhập
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tìm user theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        // Cập nhật lastLogin
        user.lastLogin = new Date();
        await user.save();

        // Tạo token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Làm mới token
const refreshToken = async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(401).json({ message: 'Không tìm thấy token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Người dùng không tồn tại' });
        }

        const newToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token: newToken });
    } catch (error) {
        res.status(401).json({ message: 'Token không hợp lệ' });
    }
};

// Đăng xuất
const logout = async (req, res) => {
    try {
        // Trong trường hợp sử dụng blacklist token, có thể thêm token vào danh sách đen ở đây
        res.json({ message: 'Đăng xuất thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Lấy thông tin người dùng hiện tại
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    getCurrentUser
};
