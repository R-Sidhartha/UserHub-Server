const express = require('express');
const main = require('./db');
const userRoutes = require('./routes/userRoutes');
const teamRoutes = require('./routes/teamRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
main();

// Middleware
app.use(express.json());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/team', teamRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

