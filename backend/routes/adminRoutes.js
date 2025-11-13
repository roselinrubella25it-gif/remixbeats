const express = require('express');
const router = express.Router();
const { login, getProfile, createAdmin } = require('../controllers/adminController');

// Admin authentication routes
router.post('/login', login);
router.post('/create', createAdmin); // For initial setup
router.get('/profile', getProfile); // Requires auth middleware

module.exports = router;