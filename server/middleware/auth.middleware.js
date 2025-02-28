// server/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user id to request
    req.userId = decoded.id;
    req.userRole = decoded.role;
    
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

exports.roleMiddleware = (role) => {
  return (req, res, next) => {
    if (req.userRole !== role) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};