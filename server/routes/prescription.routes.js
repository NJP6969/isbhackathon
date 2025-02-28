// server/routes/prescription.routes.js
const express = require('express');
const { 
  getAllPrescriptions,
  getPrescriptionById,
  getPrescriptionsByPatient,
  createPrescription,
  updatePrescription 
} = require('../controllers/prescription.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all prescriptions
router.get('/', authMiddleware, getAllPrescriptions);

// Get recent prescriptions (for dashboard)
router.get('/recent', authMiddleware, (req, res) => {
  req.query.limit = 5;
  getAllPrescriptions(req, res);
});

// Get prescriptions by patient
router.get('/patient/:patientId', authMiddleware, getPrescriptionsByPatient);

// Get single prescription
router.get('/:id', authMiddleware, getPrescriptionById);

// Create new prescription
router.post('/', authMiddleware, createPrescription);

// Update prescription
router.put('/:id', authMiddleware, updatePrescription);

module.exports = router;