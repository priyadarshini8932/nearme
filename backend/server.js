require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Business = require('./models/Business');
const Booking = require('./models/Booking');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(e => { console.error('MongoDB error:', e.message); process.exit(1); });

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
app.get('/', (_, res) => res.json({ ok: true, service: 'NearMe API' }));

// ---- Search ----
app.get('/api/locations', async (_, res) => res.json(await Business.distinct('location')));

// ?location= &category= &maxPrice= &sort=distance|rating|price
app.get('/api/businesses', async (req, res) => {
  const { location, category, maxPrice, sort } = req.query;
  const q = {};
  if (location) q.location = { $regex: `^${esc(location)}$`, $options: 'i' };
  if (category) q.category = category;
  if (maxPrice) q.price = { $lte: +maxPrice };
  const sorts = { distance: { distance: 1 }, rating: { rating: -1 }, price: { price: 1 } };
  res.json(await Business.find(q).sort(sorts[sort] || { distance: 1 }));
});

// Spec route: /api/nearby?category=
app.get('/api/nearby', async (req, res) => {
  const q = req.query.category ? { category: req.query.category } : {};
  res.json(await Business.find(q).sort({ distance: 1 }));
});

// ---- Booking ----
app.post('/api/bookings', async (req, res) => {
  try {
    const { name, phone, business, service, date, time, guests, location } = req.body;
    if (!name || !phone || !business || !date) return res.status(400).json({ success: false, error: 'Name, phone, restaurant and date are required' });
    if (!/^[0-9+ ]{10,15}$/.test(phone)) return res.status(400).json({ success: false, error: 'Enter a valid phone number' });
    const today = new Date().toISOString().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < today) return res.status(400).json({ success: false, error: 'Pick today or a future date' });
    const g = Math.min(20, Math.max(1, parseInt(guests) || 2));
    const booking = await Booking.create({ name, phone, business, service, date, time, guests: g, location });
    res.status(201).json({ success: true, booking });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// No login yet: filter by phone. Without ?phone it returns everything (admin use).
app.get('/api/bookings', async (req, res) => {
  const q = req.query.phone ? { phone: req.query.phone } : {};
  res.json(await Booking.find(q).sort({ createdAt: -1 }));
});

// ---- AI agent: search + recommend (booking is confirmed through /api/bookings) ----
app.post('/api/ai/chat', async (req, res) => {
  try {
    const question = String(req.body.question || '').trim();
    const q = question.toLowerCase();
    const all = await Business.find();
    if (!all.length) return res.json({ success: true, answer: 'No restaurants are listed yet.', results: [] });

    // 1. Where? A place named in the question wins over the default location.
    const places = [...new Set(all.map(b => b.location).filter(Boolean))];
    const named = places.find(p => q.includes(p.toLowerCase()));
    const location = named || req.body.location || '';

    // 2. How much? First number of 3+ digits is read as a per-person budget.
    const m = q.match(/(\d{3,5})/);
    const budget = m ? parseInt(m[1]) : null;

    // 3. What food? Match words from cuisine, services and name.
    const terms = new Set();
    all.forEach(b => [b.cuisine, b.name, ...(b.services || [])].filter(Boolean).forEach(t => t.toLowerCase().split(/[\s,/&-]+/).forEach(w => w.length > 3 && terms.add(w))));
    const wants = [...terms].filter(w => q.includes(w) && w !== 'restaurant');

    const score = (b) => {
      const text = [b.cuisine, b.name, ...(b.services || [])].join(' ').toLowerCase();
      return wants.filter(w => text.includes(w)).length * 2 + (b.rating || 0) - (b.distance || 0) * 0.2;
    };
    const inPlace = (b) => !location || (b.location || '').toLowerCase() === location.toLowerCase();
    const inBudget = (b) => !budget || b.price <= budget;

    let pool = all.filter(b => inPlace(b) && inBudget(b));
    let note = '';
    if (!pool.length && budget) { pool = all.filter(inPlace); note = `Nothing fits under Rs ${budget} there, so these are the closest matches. `; }
    if (!pool.length) { pool = all; note = `I found nothing in ${location}, so here are the best overall. `; }

    const results = pool.sort((a, b) => score(b) - score(a)).slice(0, 3);
    const where = named || location || 'your area';
    const answer = `${note}For "${question || 'nearby food'}" in ${where}, I'd pick ` +
      results.map(b => `${b.name} (${b.distance} km, ${b.rating}★, about Rs ${b.price} per person)`).join(', ') +
      '. Tap Book on any of them and I will fill in the booking form.';
    res.json({ success: true, answer, results });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.listen(process.env.PORT || 5000, () => console.log('API on', process.env.PORT || 5000));
