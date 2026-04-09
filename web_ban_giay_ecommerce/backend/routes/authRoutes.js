const express = require('express');
const router = express.Router();
const User = require('../models/User');

// API ĐĂNG KÝ (POST /api/auth/register)
router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, surname, shoppingPreference, day, month, year, isSubscribed } = req.body;

        // 1. Kiểm tra xem email đã tồn tại chưa
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email này đã được đăng ký!" });
        }

        // 2. Tạo User mới
        const newUser = new User({
            email, password, firstName, surname, shoppingPreference,
            dateOfBirth: { day, month, year },
            isSubscribed
        });

        await newUser.save();
        res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi đăng ký" });
    }
});

// API ĐĂNG NHẬP (POST /api/auth/login)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tìm user có email và password trùng khớp
        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(401).json({ message: "Email hoặc mật khẩu không chính xác!" });
        }

        res.status(200).json({ message: "Đăng nhập thành công!", user });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi đăng nhập" });
    }
});

module.exports = router;