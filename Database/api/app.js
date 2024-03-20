const express = require('express');
const app = express();
const imageRoutes = require('./routes/imageRoutes');
const { query } = require('../db/client');
const userRoute = require('./routes/Users');
require('dotenv').config();

// Middleware
app.use(express.json());

// Routes
app.use('/api/images', imageRoutes);
app.use('/api/users', userRoute);

// Start server
const PORT = process.env.PORT || 5432;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
