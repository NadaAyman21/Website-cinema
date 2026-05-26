const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    genre: {
        type: String, 
        required: true
    },
    runTime: {
        type: String, 
        required: true
    },
    ageRating: {
        type: String, 
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String, 
        required: true
    },
    cast: {
        type: mongoose.Schema.Types.Mixed
    },
    description: {
        type: String,
        required: true
    },  showtimes:   { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);