const URL = require('../models/urlModel');
const Analytics = require('../models/analyticsModel'); // Analytics model should be created similarly to URL Model.

async function trackAnalytics(req, res) {
  const { short_url } = req.params;

  const url = await URL.findOne({ where: { short_url } });

  if (!url) {
    return res.status(404).json({ message: 'URL not found' });
  }

  // Log the analytics (click tracking, etc.)
  await Analytics.create({ url_id: url.id, timestamp: new Date(), ip: req.ip });

  res.redirect(url.original_url); 
}

module.exports = { trackAnalytics };
