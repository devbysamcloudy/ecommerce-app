const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false,  // Changed to false
        default: ''
    },
    image: {
        type: String,
        required: false,  // Changed to false
        default: ''
    },
    category: {
        type: String,
        required: false,  // Changed to false
        default: ''
    },
    countInStock: {
        type: Number,
        required: false,  // Changed to false
        default: 0
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;