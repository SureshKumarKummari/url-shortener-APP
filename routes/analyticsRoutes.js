const express = require('express');
const { trackAnalytics } = require('../controllers/analyticsController');

const router = express.Router();

// Route to view analytics of a specific URL (this is just an example; you may need to enhance it)
router.get('/:short_url/stats', trackAnalytics);

module.exports = router;
