const express = require('express');
const app = express();

app.get('/muntasir', (req, res) => {
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  res.json({ message: `Hello, Muntasir!`, randomNumber: randomNumber });
});

app.listen(3001, () => console.log("Server ready on port 3000."));

module.exports = app;