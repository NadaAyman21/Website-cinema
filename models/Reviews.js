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
    comment: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        default: 'Guest'
    }
}, 
{ timestamps: true });
reviewSchema.pre('save', function (next) {
    if (this.item) {
        this.movie = this.item;
    }
    next();
});
module.exports = mongoose.model('Review', reviewSchema);
