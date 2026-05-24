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

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

require('dotenv').config();

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

async function getUser(req) {
    if (!req.session.userId) return null;
    return await User.findById(req.session.userId);
}



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
  try {
        const user = await getUser(req);
        const reviews = await Review.find({ 
            category: 'food-drinks' 
        }).sort({ createdAt: -1 });

        console.log("FOUND FOOD REVIEWS:", reviews); 

        res.render("food", { user, reviews });
    } catch (err) {
        console.error("Error loading Food page:", err);
        res.status(500).send("Error loading page data");
    }
});

app.get("/premier", async (req, res) => {
  
});

app.get("/stanard", async (req, res) => {
   try {
        const user = await getUser(req);
        
        // Find reviews where category is 'experience' and item is 'Standard' or 'Deluxe'
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
        // Fetch data elements simultaneously from MongoDB
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
        
        // Let's create a robust check to find whatever string name exists on your user object
        let reviewerName = 'Guest';
       
        if (user) {
            reviewerName = user.firstName; 
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
        console.error(err);
        res.status(400).send("Error saving review. Please fill out all fields.");
    }
});

// API TO FETCH EXPERIENCE REVIEWS DYNAMICALLY FOR THE BOTTOM OF PAGES
app.get("/api/reviews/experience", async (req, res) => {
    try {
        // Fetch only reviews belonging to the experience category
        const experienceReviews = await Review.find({ category: 'experience' }).sort({ createdAt: -1 });
        res.json(experienceReviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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
    res.render("profile", { user, currentPage: 'profile' });
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