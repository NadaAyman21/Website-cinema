const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const movieRoutes = require('./routes/movieRoutes');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const User = require('./models/User');
const Movie = require('./models/Movie');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5000',
  credentials: true
}));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'cinema_secret_key',
  resave: true,
  saveUninitialized: true,
  cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}));


app.use(express.static(path.join(__dirname, 'public')));

async function getUser(req) {
    if (!req.session.userId) return null;
    return await User.findById(req.session.userId);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/cinemaM", async (req, res) => {
    const user = await getUser(req);
    console.log("SESSION:", req.session);
    console.log("USER:", user);
    res.render("cinemaM", { user });
});

app.get("/", async (req, res) => {
    const user = await getUser(req);
    res.render("cinemaM", { user });
});

app.get("/food", async (req, res) => {
    const user = await getUser(req);
    res.render("food", { user });
});

app.get("/premier", async (req, res) => {
    const user = await getUser(req);
    res.render("premier", { user });
});

app.get("/stanard", async (req, res) => {
    const user = await getUser(req);
    res.render("stanard", { user });
});

app.get("/movie", async (req, res) => {
    const user = await getUser(req);
    res.render("movie", { user });
});

app.get("/normalSeats", async (req, res) => {
    const user = await getUser(req);
    res.render("normalSeats", { user });
});

app.get("/vipSeats", async (req, res) => {
    const user = await getUser(req);
    res.render("vipSeats", { user });
});

app.get("/condtions", async (req, res) => {
    const user = await getUser(req);
    res.render("condtions", { user });
});

app.get("/admin",async (req, res) => {
    try {
        console.log("ADMIN ROUTE HIT");
        const movies = await Movie.find().sort({ createdAt: -1 });
        res.render("admin", { movies: movies });
    } catch (err) {
       console.error(err);
        res.status(500).send("Error loading dashboard data"); 
    }
});

app.get("/profile", async (req, res) => {
    if (!req.session.userId) return res.redirect("/cinemaM");
    const user = await getUser(req);
    res.render("profile", { user });
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/cinemaM");
});

app.use('/api/movies', movieRoutes);

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch((err) => console.error('Database connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});