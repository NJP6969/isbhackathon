// server/routes/auth.routes.js
const express = require('express');
const { signup, login, getMe } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected route
router.get('/me', authMiddleware, getMe);

module.exports = router;