require('dotenv').config();
const express = require('express');
const app = express();
const imageRoutes = require('./routes/imageRoutes');
const { query } = require('../db/client');
const userRoute = require('./routes/Users');
const jwt = require('jsonwebtoken');

// Middleware
app.use(express.json());

// init cors
const cors = require('cors');
app.use(cors());
app.options('*', cors());

// check requests for a token and attach decoded id to request
// this attaches the 'user' property used for the 'me' request
app.use((req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;

  try {
    req.user = jwt.verify(token, process.env.JWT || 'nothing');
  } catch {
    req.user = null;
  }

  next();
});

// Routes
app.use('/api/images', imageRoutes);
app.use('/api/users', userRoute);

// Start server
const PORT = process.env.PORT || 5433;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
