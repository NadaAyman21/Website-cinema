const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie'); 

// POST: Create a new movie
router.post('/add', async (req, res) => {
  
   try {
        // Map frontend client array split if needed
        const movieData = {
            ...req.body,
            cast: typeof req.body.cast === 'string' ? req.body.cast.split(',').map(c => c.trim()) : req.body.cast
        };
        const newMovie = new Movie(movieData);
        const savedMovie = await newMovie.save();
        res.status(201).json(savedMovie);
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});










module.exports = router;