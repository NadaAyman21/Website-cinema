const express     = require('express');
const router      = express.Router();
const Reservation = require('../models/Reservation');
const Hold        = require('../models/Hold');

function isLoggedIn(req, res, next) {
  if (req.session && req.session.userId) return next();
  return res.status(401).json({ success: false, error: 'Not logged in' });
}