const express = require('express');
const { getAnalytics,getAnalyticsByTopic,getOverallAnalytics } = require('../controllers/analyticsController');
const  authenticateToken  = require('../middleware/jwtVerification');

const router = express.Router();

router.get('/:alias',authenticateToken, getAnalytics);

router.get('/topic/:topic',authenticateToken, getAnalyticsByTopic)

router.get('/overall',authenticateToken,getOverallAnalytics);

module.exports = router;
