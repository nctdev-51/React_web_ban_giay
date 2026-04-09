const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Cho phép React (Port 5173) gọi API
app.use(express.json()); // Giúp server đọc được dữ liệu JSON từ React gửi lên

// Import Routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

// Cấu hình API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Kết nối MongoDB và chạy Server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Đã kết nối tới MongoDB');
        app.listen(PORT, () => console.log(`Server đang chạy tại http://localhost:${PORT}`));
    })
    .catch((err) => console.log('Lỗi kết nối DB:', err));