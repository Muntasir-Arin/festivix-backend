const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/muntasir', (req, res) => {
  const randomNumber = Math.floor(Math.random() * 100) + 1; // Random number between 1 and 100
  res.json({ message: `Hello, Muntasir!`, randomNumber: randomNumber });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
