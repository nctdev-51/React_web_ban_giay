const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerInfo: {
        email: String,
        firstName: String,
        lastName: String,
        address: String,
        phone: String,
        paymentMethod: String
    },
    items: [
        {
            id: Number,
            title: String,
            price: Number,
            quantity: Number,
            selectedSize: Number,
            thumbnail: String
        }
    ],
    totalAmount: Number,
    status: { type: String, default: "Processing" }, // Trạng thái: Đang xử lý
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);