const rateLimit = require('rate-limiter-flexible');
const redis = require('redis');
const client = redis.createClient();

const rateLimiter = new rateLimit.RateLimiterRedis({
  storeClient: client,
  points: 100, // max points per day
  duration: 24 * 60 * 60, // 24 hours
});

module.exports = { rateLimiter };
