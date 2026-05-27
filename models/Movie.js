const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    genre: {
        type: String, // or [String] if you want to allow multiple genres
        required: true
    },
    runTime: {
        type: String, // e.g., "2h 30m"
        required: true
    },
    ageRating: {
        type: String, // e.g., "+12"
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String, // For your YouTube Embed Link
        required: true
    },
    cast: {
        type: [String], // This stores your comma-separated list as an array
        required: true
    },
    description: {
        type: String, // For your Story / Synopsis
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);