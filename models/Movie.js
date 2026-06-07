const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
       required: [true, 'Title must be at least 2 characters!'],
        trim: true,
        minlength: [2, 'Title must be at least 2 characters!']
    },
    genre: {
        type: String, 
    required: [true, 'Genre must contain letters only!'],
        trim: true,
        match: [/^[A-Za-z\s\/]+$/, 'Genre must contain letters only!']
    },
    runTime: {
        type: String, 
    required: [true, 'Time must be like: 2h or 2h 30m'],
        trim: true,
        match: [/^[0-9]+h\s?[0-9]*m?$/, 'Time must be like: 2h or 2h 30m']
    },
    ageRating: {
      type: String, 
        required: [true, 'Age must be like +12, +16, +18 etc.'],
        trim: true,
        match: [/^\+(?:[1-9]|1[0-9]|2[01])$/, 'Age must be like +12, +16, +18 etc.']
    },
    imageUrl: {
     type: String,
        required: [true, 'Image must be a valid image URL or path!'],
        trim: true,
        match: [/^(https?:\/\/.*\.(jpg|jpeg|png|gif|webp)|\.?\/?images\/.+\.(jpg|jpeg|png|gif|webp))$/i, 'Image must be a valid image URL or path!']
    },
    videoUrl: {
        type: String, 
        required: [true, 'Trailer must be a valid YouTube link!'],
        trim: true,
        match: [/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/, 'Trailer must be a valid YouTube link!']
    },
    cast: {
        type: mongoose.Schema.Types.Mixed,
        validate: {
            validator: function(v) {
                if (typeof v === 'string') return v.trim().length > 0;
                return Array.isArray(v) && v.length > 0 && v[0] !== "";
            },
            message: 'Cast information is required!'
        }
    },
    description: {
        type: String,
        required: [true, 'Story description is required!'],
        trim: true
    },  
    showtimes: 
      { type: [String], 
        default: [] 
    },
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);