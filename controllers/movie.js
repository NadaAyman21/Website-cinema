const Movie = require('../models/Movie');


exports.getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });
        res.json(movies);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ success: false, message: "Movie not found" });
        }
        res.json(movie);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.addMovie = async (req, res) => {
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
};
