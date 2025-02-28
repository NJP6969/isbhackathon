// server/routes/dashboard.routes.js
const express = require('express');
const { getDashboardStats } = require('../controllers/dashboard.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Get dashboard stats
router.get('/stats', authMiddleware, getDashboardStats);

module.exports = router;