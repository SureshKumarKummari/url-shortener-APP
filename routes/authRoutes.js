const express = require('express');
const {  googleCallback } = require('../controllers/authController');

const router = express.Router();


router.post('/login', googleCallback);

module.exports = router;
