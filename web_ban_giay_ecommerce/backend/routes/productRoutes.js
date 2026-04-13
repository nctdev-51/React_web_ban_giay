const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const {
    searchProducts,
    suggestProducts,
} = require('../control/productSearchController');

router.get('/', async (req, res) => {
    try {
        const query = req.query.sport ? { sport: req.query.sport } : {};
        const products = await Product.find(query).sort({ id: 1 });
        res.json(products);
    } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
        res.status(500).json({ message: "Lỗi server khi lấy sản phẩm" });
    }
});

// API: Gợi ý sản phẩm theo tu khoa
router.get('/suggest', suggestProducts);

// API: Tim kiem san pham theo tu khoa
router.get('/search', searchProducts);

// API: Lấy chi tiết 1 sản phẩm theo ID
router.get('/:id', async (req, res) => {
    try {
        const productId = Number(req.params.id);
        const product = await Product.findOne({ id: productId });

        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        res.json(product);
    } catch (error) {
        console.error("Lỗi lấy chi tiết sản phẩm:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

router.post('/', async (req, res) => {
    try {
        const {
            id,
            title,
            price,
            description,
            thumbnail,
            images = [],
            sport,
            productType,
            collectionName,
            gender = [],
            sizes = []
        } = req.body;

        if (!title || price === undefined || price === null) {
            return res.status(400).json({
                message: "Thiếu dữ liệu bắt buộc: title hoặc price"
            });
        }

        let newId = id;

        if (newId === undefined || newId === null || newId === "") {
            const lastProduct = await Product.findOne().sort({ id: -1 });
            newId = lastProduct ? lastProduct.id + 1 : 1;
        } else {
            const existedProduct = await Product.findOne({ id: Number(newId) });
            if (existedProduct) {
                return res.status(400).json({ message: "ID sản phẩm đã tồn tại" });
            }
        }

        const normalizedSizes = Array.isArray(sizes)
            ? sizes.map(item => ({
                  size: Number(item.size),
                  stock: Number(item.stock)
              }))
            : [];

        const newProduct = new Product({
            id: Number(newId),
            title,
            price: Number(price),
            description: description || "",
            thumbnail: thumbnail || "",
            images: Array.isArray(images) ? images : [],
            sport: sport || "",
            productType: productType || "",
            collectionName: collectionName || "",
            gender: Array.isArray(gender) ? gender : [],
            sizes: normalizedSizes
        });

        await newProduct.save();

        res.status(201).json({
            message: "Thêm sản phẩm thành công",
            product: newProduct
        });
    } catch (error) {
        console.error("Lỗi thêm sản phẩm:", error);
        res.status(500).json({ message: "Lỗi server khi thêm sản phẩm" });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const productId = Number(req.params.id);
        const updateData = { ...req.body };

        if (updateData.price !== undefined) {
            updateData.price = Number(updateData.price);
        }

        if (Array.isArray(updateData.sizes)) {
            updateData.sizes = updateData.sizes.map(item => ({
                size: Number(item.size),
                stock: Number(item.stock)
            }));
        }

        const updatedProduct = await Product.findOneAndUpdate(
            { id: productId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm để cập nhật" });
        }

        res.json({
            message: "Cập nhật sản phẩm thành công",
            product: updatedProduct
        });
    } catch (error) {
        console.error("Lỗi cập nhật sản phẩm:", error);
        res.status(500).json({ message: "Lỗi server khi cập nhật sản phẩm" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const productId = Number(req.params.id);
        const deletedProduct = await Product.findOneAndDelete({ id: productId });

        if (!deletedProduct) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm để xóa" });
        }

        res.json({
            message: "Xóa sản phẩm thành công",
            product: deletedProduct
        });
    } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
        res.status(500).json({ message: "Lỗi server khi xóa sản phẩm" });
    }
});

module.exports = router;