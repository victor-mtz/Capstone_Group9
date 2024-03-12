const express = require('express');
const app = express();
const imageRoutes = require('./routes/imageRoutes');
const { query } = require('../db/client');

// Middleware
app.use(express.json());

// Routes
app.use('/api/images', imageRoutes);

// Start server
const PORT = process.env.PORT || 5433;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
