require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Sample route to check the server is working
app.get('/', (req, res) => {
  res.send('User API is running');
});


const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);


const artworkRoutes = require('./routes/artworkRoutes');
app.use('/api/artwork', artworkRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
