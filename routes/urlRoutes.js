const express = require('express');
const { createShortUrl } = require('../controllers/urlController');
const { trackAnalytics } = require('../controllers/analyticsController');

const router = express.Router();

router.post('/shorten', createShortUrl);

router.get('/:short_url', trackAnalytics);

module.exports = router;
