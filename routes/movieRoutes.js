const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie'); // This "imports" the model you just made

// POST: Create a new movie
router.post('/add', async (req, res) => {
    try {
        const newMovie = new Movie(req.body); // req.body is the info from your Admin form
        const savedMovie = await newMovie.save();
        res.status(201).json(savedMovie);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET: Fetch all movies (for your home page later)
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;