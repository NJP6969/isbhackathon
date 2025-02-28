// server/routes/administration.routes.js
const express = require('express');
const administrationController = require('../controllers/administration.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all administrations
router.get('/', authMiddleware, administrationController.getAllAdministrations);

// Get administrations by patient
router.get('/patient/:patientId', authMiddleware, administrationController.getAdministrationsByPatient);

// Get single administration
router.get('/:id', authMiddleware, administrationController.getAdministrationById);

// Create new administration record
router.post('/', authMiddleware, administrationController.createAdministration);

// Update administration record
router.put('/:id', authMiddleware, administrationController.updateAdministration);

module.exports = router;