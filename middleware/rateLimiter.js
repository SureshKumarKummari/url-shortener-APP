const rateLimit = require('rate-limiter-flexible');
const { client }=require('../config/redis.js');

const rateLimiter = new rateLimit.RateLimiterRedis({
  storeClient: client,
  points: 1000,
  duration: 24 * 60 * 60,
});

async function rateLimiterMiddleware(req, res, next) {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (err) {
    res.status(429).json({ message: 'Too many requests, try again later.' });
  }
}

module.exports = rateLimiterMiddleware;

