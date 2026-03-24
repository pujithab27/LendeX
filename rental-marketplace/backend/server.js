const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files natively
app.use(express.static(path.join(__dirname, '../frontend')));

// Route files
const authRoutes = require('./routes/authRoutes');
const merchantRoutes = require('./routes/merchantRoutes');
const productRoutes = require('./routes/productRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/merchants', merchantRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);

// Base API route
app.get('/api', (req, res) => {
  res.send('Rental Marketplace API is running...');
});

// For any other basic GET route not part of API, throw to index.html to simulate simple UI rendering if needed.
// But mostly these are static HTML files linked natively.

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
