const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// API: Lấy toàn bộ danh sách sản phẩm
router.get('/', async (req, res) => {
    try {
        // Nếu React truyền params, ví dụ: /api/products?sport=Basketball
        const query = req.query.sport ? { sport: req.query.sport } : {};

        // Tìm trong DB
        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi lấy sản phẩm" });
    }
});

// API: Lấy chi tiết 1 sản phẩm theo ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });
        if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
});

module.exports = router;