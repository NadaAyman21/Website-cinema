const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: ['movie', 'experience', 'food-drinks'],
        default: 'movie'
    },
    item: {
        type: String,
        required: false,
        trim: true,
        default: 'General'
    },
    movie: {
        type: String,
        trim: true
    },
     rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },