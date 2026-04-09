const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: Number,
    title: String,
    price: Number,
    description: String,
    thumbnail: String,
    images: [String],
    sport: String,
    productType: String,
    collectionName: String,
    gender: [String],
    sizes: [
        {
            size: Number,
            stock: Number
        }
    ]
});

module.exports = mongoose.model('Product', productSchema);