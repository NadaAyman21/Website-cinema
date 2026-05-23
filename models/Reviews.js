const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: ['movie', 'experience', 'food-drinks'],
        default: 'movie'
    },