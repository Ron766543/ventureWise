const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes — require valid JWT
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized — no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Support both 'id' and '_id' in the token payload
    const userId = decoded.id || decoded._id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    
    // Safe check: Only block if isActive is explicitly set to false
    if (user.isActive === false) {
      return res.status(401).json({ success: false, message: 'Account has been deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// Role-based access control
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Prevent server crash if 'protect' middleware was forgotten in the route chain
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user ? req.user.role : 'guest'}' is not authorized to access this route`
      });
    }
    next();
  };
};

// Optional auth — attach user if token present, but don't block
exports.optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const userId = decoded.id || decoded._id;
    const user = await User.findById(userId).select('-password');
    
    // Only attach if user is active
    if (user && user.isActive !== false) {
      req.user = user;
    }
  } catch (_) { /* ignore */ }
  next();
};