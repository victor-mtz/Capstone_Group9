const express = require('express');
const app = express();
const imageRoutes = require('./imageRoutes');

// Middleware
app.use(express.json());

// Routes
app.use('/api/images', imageRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
