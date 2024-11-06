const express = require('express');
const connectToDatabase = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();
app.use(express.json());
connectToDatabase();

app.get('/muntasir', (req, res) => {
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  res.json({ message: `Hello`, randomNumber: randomNumber });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.listen(3001, () => console.log("Server ready on port 3000."));

module.exports = app;