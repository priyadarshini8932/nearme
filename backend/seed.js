require('dotenv').config();
const mongoose = require('mongoose');
const Business = require('./models/Business');

const dine = ['Dine-in', 'Takeaway', 'Table booking'];
const data = [
  { name: 'Spice Route Kitchen', cuisine: 'North Indian', location: 'Pimpri', distance: 0.8, rating: 4.8, price: 499, services: dine, phone: '9000000001', description: 'Tandoor grills and slow-cooked curries.' },
  { name: 'Coastal Catch', cuisine: 'Seafood', location: 'Pimpri', distance: 1.2, rating: 4.7, price: 699, services: [...dine, 'Home delivery'], phone: '9000000002', description: 'Konkan-style fish thali and prawn fry.' },
  { name: 'Alandi Bhojanalay', cuisine: 'Maharashtrian', location: 'Alandi', distance: 2.1, rating: 4.9, price: 399, services: ['Dine-in', 'Table booking'], phone: '9000000003', description: 'Unlimited thali served on banana leaf.' },
  { name: 'Roma Slice', cuisine: 'Italian', location: 'Chinchwad', distance: 1.9, rating: 4.5, price: 599, services: [...dine, 'Home delivery'], phone: '9000000004', description: 'Wood-fired pizza and fresh pasta.' },
  { name: 'Green Bowl', cuisine: 'Vegetarian', location: 'Pimpri', distance: 0.5, rating: 4.4, price: 349, services: ['Dine-in', 'Takeaway'], phone: '9000000005', description: 'Salads, wraps and cold-pressed juices.' },
  { name: 'Dragon Wok', cuisine: 'Chinese', location: 'Chinchwad', distance: 2.6, rating: 4.3, price: 449, services: dine, phone: '9000000006', description: 'Hakka noodles, momos and Szechuan specials.' }
].map(b => ({ ...b, category: 'Restaurant' }));

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Business.deleteMany({});
  await Business.insertMany(data);
  console.log(`Seeded ${data.length} restaurants`);
  process.exit(0);
})();
