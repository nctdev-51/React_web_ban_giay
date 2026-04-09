const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// API TẠO ĐƠN HÀNG (POST /api/orders)
router.post('/', async (req, res) => {
    try {
        // Log ra xem React gửi gì lên
        console.log("📥 Đang nhận đơn hàng mới:", req.body);

        const newOrder = new Order({
            customerInfo: req.body.customerInfo,
            items: req.body.items,
            totalAmount: req.body.totalAmount
        });

        await newOrder.save();
        console.log("✅ Đã lưu đơn hàng vào DB thành công!");

        res.status(201).json({ message: "Đặt hàng thành công!", order: newOrder });
    } catch (error) {
        console.error("❌ Lỗi server khi lưu đơn:", error);
        res.status(500).json({ message: "Lỗi server khi tạo đơn hàng", error: error.message });
    }
});

// API Lấy danh sách đơn hàng (GET /api/orders)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }); // Xếp mới nhất lên đầu
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
});

module.exports = router;