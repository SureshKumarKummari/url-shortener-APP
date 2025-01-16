const express = require('express');
const { googleSignIn } = require('../controllers/authController');

const router = express.Router();

// Route for Google Sign-In authentication
router.post('/google-signin', googleSignIn);

module.exports = router;
