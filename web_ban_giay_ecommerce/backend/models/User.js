const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Thực tế sẽ mã hóa bcrypt, đồ án thì để text tạm cho dễ test
    firstName: String,
    surname: String,
    role: { type: String, default: "user" },
    shoppingPreference: String,
    dateOfBirth: {
        day: Number,
        month: Number,
        year: Number
    },
    isSubscribed: Boolean,
    createdAt: { type: Date, default: Date.now },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product' // Tên này phải trùng với tên model trong Product.js
    }]
});

module.exports = mongoose.model('User', userSchema);