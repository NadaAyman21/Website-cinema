const express     = require('express');
const router      = express.Router();
const Reservation = require('../models/Reservation');
const Hold        = require('../models/Hold');

function isLoggedIn(req, res, next) {
  if (req.session && req.session.userId) return next();
  return res.status(401).json({ success: false, error: 'Not logged in' });
}

router.post('/save', isLoggedIn, async (req, res) => {
  try {
    const { movie, showtime, date, hall, seats, totalPrice } = req.body;
    const orderNumber = 'CX-' + Date.now();
    const userId      = req.session.userId.toString();

    const reservation = await Reservation.create({
      user: req.session.userId,
      movie, showtime, date, hall,
      seats:      JSON.parse(seats),
      totalPrice: Number(totalPrice),
      orderNumber
    });

    await Hold.deleteMany({ movie, showtime, date, hall, userId });
    res.json({ success: true, reservationId: reservation._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/hold', async (req, res) => {
  try {
    const { movie, showtime, date, hall, seats } = req.body;
    const userId = req.session?.userId?.toString();

    await Hold.deleteMany({ movie, showtime, date, hall, userId });

    if (!seats || JSON.parse(seats).length === 0) {
      return res.json({ success: true });
    }

    await Hold.create({
      movie, showtime, date, hall,
      seats: JSON.parse(seats),
      userId
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/seats', async (req, res) => {
  try {
    const { movie, showtime, date, hall } = req.query;
    const userId = req.session?.userId?.toString();

    console.log('Seats query:', { movie, showtime, date, hall });

    const [reservations, holds] = await Promise.all([
      Reservation.find({ movie, showtime, date, hall }),
      Hold.find({ movie, showtime, date, hall })
    ]);

    console.log('Reservations found:', reservations.length, reservations.map(r => r.seats));
    console.log('Holds found:', holds.length, holds.map(h => h.seats));

    const takenSeats = reservations.flatMap(r => r.seats);
    const holdSeats  = holds
      .filter(h => h.userId !== userId)
      .flatMap(h => h.seats);

    res.json({ taken: takenSeats, hold: holdSeats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/my', isLoggedIn, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.session.userId }).sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/admin/all', async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/admin/all/clear', async (req, res) => {
  try {
    await Reservation.deleteMany({});
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});