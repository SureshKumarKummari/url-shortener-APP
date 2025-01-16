const { rateLimiter } = require('../config/rateLimit');

async function rateLimiterMiddleware(req, res, next) {
  try {
    await rateLimiter.consume(req.ip); // Limit requests by IP
    next();
  } catch (err) {
    res.status(429).json({ message: 'Too many requests, try again later.' });
  }
}

module.exports = rateLimiterMiddleware;
