const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer')
    return res.status(401).json({ message: 'Invalid token' });

  try {
    req.user = jwt.verify(parts[1], process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};