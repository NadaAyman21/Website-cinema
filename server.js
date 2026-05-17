const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const movieRoutes = require('./routes/movieRoutes');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'cinema_secret_key',
  resave: false,
  saveUninitialized: false
}));


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
app.get("/movie", (req, res) => {
    res.render("movie"); 
});

app.get("/normalSeats", (req, res) => {
    res.render("normalSeats"); 
});
app.get("/vipSeats", (req, res) => {
    res.render("vipSeats"); 
});
app.get("/condtions", (req, res) => {
    res.render("condtions"); 
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