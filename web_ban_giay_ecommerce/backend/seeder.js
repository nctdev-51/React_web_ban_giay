const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

// Import Model Product của bạn
const Product = require('./models/Product');

// Kết nối DB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Đã kết nối MongoDB để bơm dữ liệu...'))
    .catch(err => console.log(err));

// Đọc file db.json
const data = JSON.parse(fs.readFileSync('./db.json', 'utf-8'));

const importData = async () => {
    try {
        // 1. Xóa sạch dữ liệu cũ trong bảng Products (nếu có) để tránh trùng lặp
        await Product.deleteMany();
        console.log('Đã xóa dữ liệu cũ...');

        // 2. Bơm toàn bộ mảng "products" từ file db.json vào MongoDB
        await Product.insertMany(data.products);
        console.log('BƠM DỮ LIỆU THÀNH CÔNG! Đã thêm các đôi giày vào Database.');

        process.exit(); // Tắt script sau khi xong
    } catch (error) {
        console.error('Lỗi khi bơm dữ liệu:', error);
        process.exit(1);
    }
};

importData();