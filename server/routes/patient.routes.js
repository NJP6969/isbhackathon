// Create this file at: server/routes/patient.routes.js
const express = require('express');
const { 
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
} = require('../controllers/patient.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all patients
router.get('/', authMiddleware, getAllPatients);

// Get patient by ID
router.get('/:id', authMiddleware, getPatientById);

// Create new patient
router.post('/', authMiddleware, createPatient);

// Update patient
router.put('/:id', authMiddleware, updatePatient);

// Delete patient (admin only)
router.delete('/:id', [authMiddleware, roleMiddleware('admin')], deletePatient);

module.exports = router;