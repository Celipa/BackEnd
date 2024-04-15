const jwt = require('jsonwebtoken')
require('dotenv').config()


exports.generateToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' })
}

