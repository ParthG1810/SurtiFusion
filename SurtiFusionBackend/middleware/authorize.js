const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = allowedRoles => (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  const [scheme, token] = auth.split(' ');
  if (scheme !== 'Bearer' || !token)
    return res.status(401).json({ message: 'Invalid token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!allowedRoles.includes(payload.role))
      return res.status(403).json({ message: 'Forbidden' });
    req.user = payload;
    next();
  } catch (err) {
    console.error('Authorize error:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};