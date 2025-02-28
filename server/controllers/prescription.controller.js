// server/controllers/prescription.controller.js
const Prescription = require('../models/prescription.model');
const Patient = require('../models/patient.model');

exports.getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('patient', 'name mrn')
      .populate('doctor', 'name')
      .populate('medications.medication', 'name dosageForm strength');
    
    res.status(200).json({ prescriptions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
  }
};

exports.getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient')
      .populate('doctor', 'name email specialization')
      .populate('medications.medication');
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    res.status(200).json({ prescription });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescription', error: error.message });
  }
};

exports.getPrescriptionsByPatient = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.params.patientId })
      .populate('medications.medication')
      .populate('doctor', 'name');
    
    res.status(200).json({ prescriptions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
  }
};

exports.createPrescription = async (req, res) => {
  try {
    const { patientId, diagnosis, medications, notes } = req.body;
    
    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    const prescription = new Prescription({
      patient: patientId,
      doctor: req.userId,
      diagnosis,
      medications,
      notes
    });
    
    await prescription.save();
    
    res.status(201).json({ 
      message: 'Prescription created successfully', 
      prescription 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating prescription', error: error.message });
  }
};

exports.updatePrescription = async (req, res) => {
  try {
    const { medications, status, notes } = req.body;
    
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    // Only allow the doctor who created the prescription to update it
    if (prescription.doctor.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this prescription' });
    }
    
    // Update fields
    if (medications) prescription.medications = medications;
    if (status) prescription.status = status;
    if (notes) prescription.notes = notes;
    
    prescription.updatedAt = Date.now();
    
    await prescription.save();
    
    res.status(200).json({
      message: 'Prescription updated successfully',
      prescription
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating prescription', error: error.message });
  }
};