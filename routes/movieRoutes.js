const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie');


router.get('/', movieController.getAllMovies);          // Used on homepage
router.get('/:id', movieController.getMovieById);       // Used on movie detail page

// Admin management routes
router.post('/add', movieController.addMovie);
router.put('/edit/:id', movieController.editMovie);
router.delete('/delete/:id', movieController.deleteMovie);
router.get('/', async (req, res) => {
        try {
        const movies = await Movie.find().sort({ createdAt: -1 });
        res.json(movies);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
module.exports = router;

