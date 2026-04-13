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
        const user = await User.findOne({ email, password }).populate('favorites');

        if (!user) {
            return res.status(401).json({ message: "Email hoặc mật khẩu không chính xác!" });
        }

        res.status(200).json({ message: "Đăng nhập thành công!", user });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi đăng nhập" });
    }
});

// API Yêu thích sản phẩm
router.post('/favorite', async (req, res) => {
    try {
        const { userId, productId } = req.body;
        
        // 1. Tìm user
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

        // 2. Kiểm tra xem đã yêu thích chưa
        const isFavorite = user.favorites.includes(productId);

        if (isFavorite) {
            user.favorites.pull(productId); // Xóa ID sản phẩm khỏi mảng
        } else {
            user.favorites.push(productId); // Thêm ID sản phẩm vào mảng
        }

        // 3. Lưu và trả về mảng favorites đã được cập nhật thông tin sản phẩm (populate)
        await user.save();
        
        // Nếu muốn frontend nhận được đầy đủ thông tin sản phẩm ngay lập tức:
        const updatedUser = await User.findById(userId).populate('favorites');
        
        res.status(200).json({ 
            message: isFavorite ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích",
            favorites: updatedUser.favorites 
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
});

router.get('/profile/:userId', async (req, res) => {
    try {
        // .populate('favorites') để lấy chi tiết thông tin sản phẩm thay vì chỉ lấy ID
        const user = await User.findById(req.params.userId).populate('favorites');
        
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
});

module.exports = router;