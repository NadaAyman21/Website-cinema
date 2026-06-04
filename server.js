require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const movieRoutes = require('./routes/movieRoutes');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const User = require('./models/User');
const Movie = require('./models/Movie');
const Review = require('./models/Reviews');
const reservationRoutes = require('./routes/reservationRoutes');
require('./models/Hold');  

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:5000',
  credentials: true
}));

app.use(session({
  secret: 'cinema_secret_key',
  resave: true,
  saveUninitialized: true,
  cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/reservation', reservationRoutes);
async function getUser(req) {
    if (!req.session.userId) return null;
    return await User.findById(req.session.userId);
}


app.get("/cinemaM", async (req, res) => {
    const user = await getUser(req);
    res.render("cinemaM", { user });
});

app.get("/", async (req, res) => {
    const user = await getUser(req);
    res.render("cinemaM", { user });
});

app.get("/reset-password", (req, res) => {
  res.render("resetPassword", { token: req.query.token });
});

app.get("/ticket/:id", async (req, res) => {
  if (!req.session.userId) return res.redirect("/cinemaM");
  const user = await getUser(req);
  res.render("ticket", { user, reservationId: req.params.id });
});

app.get("/food", async (req, res) => {
  try {
        const user = await getUser(req);
        const reviews = await Review.find({ category: 'food-drinks' }).sort({ createdAt: -1 });
        res.render("food", { user, reviews });
    } catch (err) {
        console.error("Error loading Food page:", err);
        res.status(500).send("Error loading page data");
    }
});

app.get("/premier", async (req, res) => {
   try {
        const user = await getUser(req);
        const reviews = await Review.find({ 
            category: 'experience', 
            item: { $regex: /^premiere$/i } 
        }).sort({ createdAt: -1 });
        res.render("premier", { user, reviews });
    } catch (err) {
        console.error("Error loading Premiere page:", err);
        res.status(500).send("Error loading page data");
    }
});

app.get("/stanard", async (req, res) => {
   try {
        const user = await getUser(req);
        const reviews = await Review.find({ 
            category: 'experience', 
            item: { $in: ['Standard', 'Deluxe'] } 
        }).sort({ createdAt: -1 });
        res.render("stanard", { user, reviews });
    } catch (err) {
        console.error("Error loading Standard page:", err);
        res.status(500).send("Error loading page data");
    }
});


app.get("/reviews", async (req, res) => {
   try {
        const user = await getUser(req);
        const [reviews, movies] = await Promise.all([
            Review.find().sort({ createdAt: -1 }),
            Movie.find().sort({ title: 1 })
        ]);
        res.render("reviews", { user, reviews, movies });
    } catch (err) {
        console.error("Error loading reviews dashboard:", err);
        res.status(500).send("Error loading reviews");
    }
});

app.post("/reviews", async (req, res) => {
    try {
        const user = await getUser(req);
        
        let reviewerName = 'Guest';
        if (user && user.firstName) {
            reviewerName = user.firstName; 
        }

       
        if (!req.body.rating || !req.body.comment || req.body.comment.trim() === "") {
            return res.redirect("/reviews?error=missing_fields");
        }

        const newReview = new Review({
            category: req.body.category || 'movie',
            item: req.body.item || 'General',
            rating: parseInt(req.body.rating),
            comment: req.body.comment,
            userName: reviewerName
        });

        await newReview.save();
        res.redirect("/reviews"); 
    } catch (err) {
        console.error("Database Save Error:", err);
        res.redirect("/reviews?error=server_issue");
    }
});


app.get("/api/reviews/experience", async (req, res) => {
    try {
        const experienceReviews = await Review.find({ category: 'experience' }).sort({ createdAt: -1 });
        res.json(experienceReviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/normalSeats", async (req, res) => {
   try {
        const user = await getUser(req);
        
        let movie = null;
        if (req.query.id) {
            movie = await Movie.findById(req.query.id);
            
            if (movie && movie.imageUrl) {
                let imgPath = movie.imageUrl.trim();
                if (!imgPath.startsWith('/') && !imgPath.startsWith('http')) {
                    movie.imageUrl = '/' + imgPath;
                }
            }
        }

        res.render("normalSeats", { user, movie });
    } catch (err) {
        console.error("Error loading seating map:", err);
        res.status(500).send("Error loading seat configuration");
    }
});

app.get("/vipSeats", async (req, res) => {
    try {
        const user = await getUser(req);
        
        let movie = null;
        if (req.query.id) {
            movie = await Movie.findById(req.query.id);
            if (movie && movie.imageUrl) {
                let imgPath = movie.imageUrl.trim();
                if (!imgPath.startsWith('/') && !imgPath.startsWith('http')) {
                    movie.imageUrl = '/' + imgPath;
                }
            }
        }
        res.render("vipSeats", { user, movie });
    } catch (err) {
        console.error("Error loading VIP seating map:", err);
        res.status(500).send("Error loading VIP seat configuration");
    }

});

app.get("/condtions", async (req, res) => {
     try {
        const user = await getUser(req);
        let movie = null;
        if (req.query.id) {
            movie = await Movie.findById(req.query.id);
        }
        res.render("condtions", { user, movie });
    } catch (err) {
        console.error("Error loading conditions page:", err);
        res.status(500).send("Server Error");
    }

});

app.get("/admin", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.redirect("/cinemaM");
    }
    const user = await User.findById(req.session.userId);
    if (!user || user.role !== 'admin') {
      return res.redirect("/cinemaM");
    }

    const movies = await Movie.find().sort({ createdAt: -1 });
    res.render("admin", { movies });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading dashboard data");
  }
});

app.get("/profile", async (req, res) => {
  if (!req.session.userId) return res.redirect("/cinemaM");
  const user         = await getUser(req);
  const Reservation  = require('./models/Reservation');
  const reservations = await Reservation.find({ user: req.session.userId }).sort({ createdAt: -1 });
  res.render("profile", { user, currentPage: 'profile', reservations });
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/cinemaM");
});

app.get("/orderSum", async (req, res) => {
    const user = await getUser(req);
    res.render("orderSum", { user });
});

app.get("/form", async (req, res) => {
    const user = await getUser(req);
    res.render("form", { user });
});


app.use('/movie', movieRoutes);
app.use('/api/auth', authRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch((err) => console.error('Database connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});