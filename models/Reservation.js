// models/Reservation.js
const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie:       { type: String, required: true },
  showtime:    { type: String, required: true },
  date:        { type: String, required: true },
  hall:        { type: String, required: true },        // Standard / Deluxe / VIP
  seats:       { type: [String], required: true },      // ['A1', 'B3']
  totalPrice:  { type: Number, required: true },
  orderNumber: { type: String, unique: true },
  status:      { type: String, default: 'confirmed' },  // confirmed / cancelled
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reservation', ReservationSchema);