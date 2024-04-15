const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    let message = 'Access restricted. Please login.';
    if (err.name === 'TokenExpiredError') {
      message = 'Session expired, please login.';
    } else if (err.name === 'JsonWebTokenError') {
      message = 'Invalid token.';
    }
    res.status(401).json({ message });
  }
};