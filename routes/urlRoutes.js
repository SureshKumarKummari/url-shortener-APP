const express = require('express');
const { createShortUrl } = require('../controllers/urlController');
const { trackAnalytics } = require('../controllers/analyticsController');

const router = express.Router();

// Route to create a short URL
router.post('/shorten', createShortUrl);

// Route to handle analytics and redirect to original URL
router.get('/:short_url', trackAnalytics);

module.exports = router;
