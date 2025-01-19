const express = require('express');
const { createShortUrl,redirectUrl } = require('../controllers/urlController');
const  authenticateToken  = require('../middleware/jwtVerification'); 

const router = express.Router();

router.post('/shorten', authenticateToken, createShortUrl); 
router.get('/shorten/:alias',authenticateToken, redirectUrl); 

module.exports = router;
