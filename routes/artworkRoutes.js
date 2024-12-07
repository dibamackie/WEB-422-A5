const express = require('express');
const router = express.Router();
const authMiddleware = require('./authMiddleware');

// Sample route to get artworks (this route is protected by the authMiddleware)
router.get('/', authMiddleware, (req, res) => {
  res.json({ message: 'Protected Artwork API - Only accessible by authenticated users' });
});

module.exports = router;
