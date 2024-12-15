const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const connectToDatabase = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const applyManagerRoutes = require('./routes/applyManagerRoutes');


const app = express();
const server = http.createServer(app);
socketSetup(server);

app.use(express.json());
app.use(cors());
connectToDatabase();

app.get('/', (req, res) => {
  res.json({ msg: `Greetings from Muntasir!` });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applymanager', applyManagerRoutes );

const port = process.env.PORT || 8000;  
app.listen(port, () => {
  console.log(`Server ready on port ${port}`);
});

module.exports = app;