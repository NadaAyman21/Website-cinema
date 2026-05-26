const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie');
const Movie = require('../models/Movie');
const User = require('../models/User');

async function getUser(req) {
    if (!req.session || !req.session.userId) return null;
    return await User.findById(req.session.userId);
}

router.get('/', movieController.getAllMovies);          
router.get('/:id', movieController.getMovieById);       


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
