
const mongoose = require('mongoose');

const HoldSchema = new mongoose.Schema({
  movie:    { type: String, required: true },
  showtime: { type: String, required: true },
  date:     { type: String, required: true },
  hall:     { type: String, required: true },
  seats:    { type: [String], required: true },
  userId:   { type: String },
  expiresAt:{ type: Date, default: () => new Date(Date.now() + 15 * 60 * 1000) } // 15 min
});


HoldSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Hold', HoldSchema);