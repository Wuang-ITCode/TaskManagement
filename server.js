const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Cấu hình CORS chi tiết
app.use(cors({
    origin: '*', // Cho phép tất cả các origin trong môi trường development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Định tuyến API
const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const stageRoutes = require('./routes/stageRoutes');
const authRoutes = require('./routes/auth');
const memberRoutes = require('./routes/memberRoutes');

app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stages', stageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);

// Serve static files
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/', express.static(path.join(__dirname, 'web')));

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Kết nối MongoDB và khởi chạy server
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ Kết nối MongoDB thành công');
    app.listen(PORT, () => {
        console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
    });
})
.catch(err => {
    console.error('❌ Kết nối MongoDB thất bại:', err);
    process.exit(1);
});
