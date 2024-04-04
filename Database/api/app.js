require('dotenv').config();
const express = require('express');
const app = express();
const imageRoutes = require('./routes/imageroutes');
const { query } = require('../db/client');
const userRoute = require('./routes/Users');

// Middleware
app.use(express.json());

// init cors
const cors = require('cors');
app.use(cors());
app.options('*', cors());

// Routes
app.use('/api/images', imageRoutes);
app.use('/api/users', userRoute);


const PORT = process.env.PORT || 5432;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
