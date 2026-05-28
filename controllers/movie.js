const Movie = require('../models/Movie');

// 1. GET ALL MOVIES
exports.getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });
        res.json(movies);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 2. GET MOVIE BY ID
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
        const castData = typeof req.body.cast === 'string' 
            ? req.body.cast.split(',').map(c => c.trim()) 
            : req.body.cast;

       
        const processedShowtimes = Array.isArray(req.body.showtimes) ? req.body.showtimes : [];

        const movieData = {
            ...req.body,
            cast: castData,
            showtimes: processedShowtimes 
        };

        const newMovie = new Movie(movieData);
        const savedMovie = await newMovie.save();
        res.status(201).json(savedMovie);
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};


exports.editMovie = async (req, res) => {
    try {
        const castData = typeof req.body.cast === 'string' 
            ? req.body.cast.split(',').map(c => c.trim()) 
            : req.body.cast;
        const processedShowtimes = Array.isArray(req.body.showtimes) ? req.body.showtimes : [];

        const movieData = {
            ...req.body,
            cast: castData,
            showtimes: processedShowtimes
        };

        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, movieData, { new: true });
        if (!updatedMovie) return res.status(404).json({ message: "Movie not found" });
        res.json(updatedMovie);
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.deleteMovie = async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
        if (!deletedMovie) return res.status(404).json({ message: "Movie not found" });
        res.json({ success: true, message: "Movie deleted successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};