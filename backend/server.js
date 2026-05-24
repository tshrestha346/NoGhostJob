const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
    res.send('API is running.');
});

mongoose.connect(process.env.MONGODB)
  .then(() => {
    console.log('Database Connected');
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});