const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const applyManagerRoutes = require('./routes/applyManagerRoutes');

// Import the campaign routes
const campaignRoutes = require('./routes/campaignRoutes');

const app = express();
app.use(express.json());
app.use(cors());
connectToDatabase();

app.get('/', (req, res) => {
  res.json({ msg: `Greetings from Muntasir!` });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applymanager', applyManagerRoutes );
app.use('/api/campaigns', campaignRoutes);

const port = process.env.PORT || 8000;  
app.listen(port, () => {
  console.log(`Server ready on port ${port}`);
});

module.exports = app;