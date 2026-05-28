const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie');
const Movie = require('../models/Movie');
const User = require('../models/User');
const Review = require('../models/Reviews'); // Matches your server.js model naming spelling

async function getUser(req) {
    if (!req.session || !req.session.userId) return null;
    return await User.findById(req.session.userId);
}

router.get('/', async (req, res, next) => {
    if (!req.query.id) {
        return next();
    }
    
    try {
        const user = await getUser(req);
        const movie = await Movie.findById(req.query.id);
        if (!movie) return res.status(404).send("Movie Not Found");

        // FIX: Look up using 'item' field to match your rev.js form structure
        const movieReviews = await Review.find({
            category: 'movie',
            item: movie.title
        }).sort({ createdAt: -1 });

        const activeShowtimes = Array.isArray(movie.showtimes) ? movie.showtimes : [];

        const bookingDays = [];
        for (let i = 0; i < 4; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            bookingDays.push({
                dayLabel: i === 0 ? "Today" : d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
                dateLabel: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
                dateString: d.toISOString().split('T')[0]
            });
        }

        res.render('movie', { 
            user,
            movie, 
            bookingDays, 
            reviews: movieReviews, // Passes the correctly filtered array down to the view template
            showtimes: JSON.stringify(activeShowtimes) 
        });
    } catch (err) {
        res.status(500).send("Error rendering page view: " + err.message);
    }
});

// Keep your existing lower api router points below unchanged
router.get('/api/all', movieController.getAllMovies);      
router.get('/:id', movieController.getMovieById);  
router.post('/add', movieController.addMovie);
router.put('/edit/:id', movieController.editMovie);
router.delete('/delete/:id', movieController.deleteMovie);

module.exports = router;