const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const movieRoutes = require('./routes/movieRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());



app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/cinemaM", (req, res) => {

    res.render("cinemaM");

});

app.get("/", (req, res) => {

    res.render("cinemaM");
});

app.get("/food", (req, res) => {
    res.render("food"); 
});

app.get("/premier", (req, res) => {
    res.render("premier"); 
});
app.get("/stanard", (req, res) => {
    res.render("stanard"); 
});

app.get("/admin", (req, res) => {
    console.log("ADMIN ROUTE HIT");
    res.render("admin");
});

app.use('/api/movies', movieRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch((err) => console.error('Database connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});