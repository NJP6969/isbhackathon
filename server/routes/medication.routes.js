// server/routes/medication.routes.js
const express = require('express');
const { 
  getAllMedications, 
  getMedicationById, 
  createMedication, 
  updateMedication, 
  deleteMedication 
} = require('../controllers/medication.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all medications (accessible to all authenticated users)
router.get('/', authMiddleware, getAllMedications);

// Get single medication by ID
router.get('/:id', authMiddleware, getMedicationById);

// Create, update, delete routes (admin only)
router.post('/', [authMiddleware, roleMiddleware('admin')], createMedication);
router.put('/:id', [authMiddleware, roleMiddleware('admin')], updateMedication);
router.delete('/:id', [authMiddleware, roleMiddleware('admin')], deleteMedication);

module.exports = router;