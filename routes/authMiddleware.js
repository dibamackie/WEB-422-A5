const jwt = require('jsonwebtoken');

// Middleware to verify JWT Token
function authMiddleware(req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // Call next() to pass control to the next handler
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
}

module.exports = authMiddleware;
