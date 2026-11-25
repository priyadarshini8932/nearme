const mongoose = require('mongoose');
module.exports = mongoose.model('Booking', new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  business: { type: String, required: true },
  service: String,
  date: { type: String, required: true },   // YYYY-MM-DD
  time: String,
  guests: { type: Number, default: 2 },
  location: String,
  status: { type: String, default: 'confirmed' }
}, { timestamps: true }));
