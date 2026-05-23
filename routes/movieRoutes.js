const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie');
/*const Movie = require('../models/Movie'); 

router.post('/add', async (req, res) => {
  
   try {
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

router.get('/', async (req, res) => {
        try {
        const movies = await Movie.find().sort({ createdAt: -1 });
        res.json(movies);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }

});
router.put('/edit/:id', async (req, res) => {
    try {
        const movieData = {
            ...req.body,
            cast: typeof req.body.cast === 'string' ? req.body.cast.split(',').map(c => c.trim()) : req.body.cast
        };
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, movieData, { new: true });
        if (!updatedMovie) return res.status(404).json({ message: "Movie not found" });
        res.json(updatedMovie);
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
        if (!deletedMovie) return res.status(404).json({ message: "Movie not found" });
        res.json({ success: true, message: "Movie deleted successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});*/



router.get('/', movieController.getAllMovies);          // Used on homepage
router.get('/:id', movieController.getMovieById);       // Used on movie detail page

// Admin management routes
router.post('/add', movieController.addMovie);
router.put('/edit/:id', movieController.editMovie);
router.delete('/delete/:id', movieController.deleteMovie);



module.exports = router;