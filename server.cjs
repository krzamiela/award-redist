// server.js
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 9000; // Port can be set via environment variable

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});