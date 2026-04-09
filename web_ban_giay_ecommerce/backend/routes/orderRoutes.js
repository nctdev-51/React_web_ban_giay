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

// LẤY LỊCH SỬ ĐƠN HÀNG CỦA USER CỤ THỂ (Cho Task 3)
router.get('/user/:email', async (req, res) => {
    try {
        const userEmail = req.params.email;
        // Tìm các đơn hàng có email khớp với email truyền vào
        const orders = await Order.find({ "customerInfo.email": userEmail }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy lịch sử đơn hàng" });
    }
});

// [STAFF] CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (Cho Task 2)
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body; // Ví dụ: "Đang giao", "Hoàn thành"
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        );
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật trạng thái" });
    }
});

module.exports = router;