const mongoose = require('mongoose');
module.exports = mongoose.model('Business', new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: 'Restaurant' },
  cuisine: String,
  location: String,
  distance: Number,      // km from the centre of the area
  rating: Number,
  price: Number,         // average spend per person, in rupees
  services: [String],
  phone: String,
  description: String
}, { timestamps: true }));
