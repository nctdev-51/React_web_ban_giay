const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Thực tế sẽ mã hóa bcrypt, đồ án thì để text tạm cho dễ test
    firstName: String,
    surname: String,
    shoppingPreference: String,
    dateOfBirth: {
        day: Number,
        month: Number,
        year: Number
    },
    isSubscribed: Boolean,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);