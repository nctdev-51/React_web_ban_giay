const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// API TẠO ĐƠN HÀNG (POST /api/orders)
router.post('/', async (req, res) => {
    try {
        console.log("📥 Đang nhận đơn hàng mới:", req.body);

        const newOrder = new Order({
            customerInfo: req.body.customerInfo,
            items: req.body.items,
            totalAmount: req.body.totalAmount,
            status: req.body.status || "Processing"
        });

        await newOrder.save();

        res.status(201).json({
            message: "Đặt hàng thành công!",
            order: newOrder
        });
    } catch (error) {
        console.error("❌ Lỗi server khi lưu đơn:", error);
        res.status(500).json({
            message: "Lỗi server khi tạo đơn hàng",
            error: error.message
        });
    }
});

// API Lấy danh sách đơn hàng (GET /api/orders)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error("Lỗi lấy danh sách đơn hàng:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// API lấy lịch sử đơn hàng của 1 user cụ thể
// GET /api/orders/user/:email
router.get('/user/:email', async (req, res) => {
    try {
        const userEmail = req.params.email;

        const orders = await Order.find({
            "customerInfo.email": userEmail
        }).sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error("Lỗi lấy lịch sử đơn hàng:", error);
        res.status(500).json({ message: "Lỗi khi lấy lịch sử đơn hàng" });
    }
});

// [STAFF] CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
// PUT /api/orders/:id
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Thiếu status để cập nhật" });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        res.json({
            message: "Cập nhật trạng thái đơn hàng thành công",
            order: updatedOrder
        });
    } catch (error) {
        console.error("Lỗi cập nhật trạng thái:", error);
        res.status(500).json({ message: "Lỗi cập nhật trạng thái" });
    }
});

module.exports = router;