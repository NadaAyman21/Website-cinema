const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const movieRoutes = require('./routes/movieRoutes'); 
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- ADD THIS LINE TO SERVE YOUR FRONTEND ---
app.use(express.static(__dirname));

// Routes
app.use('/api/movies', movieRoutes); 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch((err) => console.error('Database connection error:', err));

// Note: The old app.get('/') test route was removed from here
// so that your frontend HTML files can load instead!

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});