const express = require('express');
const bodyParser = require('body-parser');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();

// Middleware
app.use(bodyParser.json()); // To parse incoming JSON data

// Use the feedback route
app.use('/api', feedbackRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
