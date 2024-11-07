const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();
app.use(express.json());
app.use(cors());
connectToDatabase();

app.get('/muntasir', (req, res) => {
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  res.json({ message: `Hello`, randomNumber: randomNumber });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes );

app.listen(3001, () => console.log("Server ready on port 3000."));

module.exports = app;