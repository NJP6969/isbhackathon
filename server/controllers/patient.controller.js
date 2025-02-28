// server/controllers/patient.controller.js
const Patient = require('../models/patient.model');

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('assignedDoctor', 'name');
    
    res.status(200).json({ patients });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('assignedDoctor', 'name email');
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.status(200).json({ patient });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient', error: error.message });
  }
};

exports.createPatient = async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    await newPatient.save();
    
    res.status(201).json({ 
      message: 'Patient created successfully', 
      patient: newPatient 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating patient', error: error.message });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.status(200).json({
      message: 'Patient updated successfully',
      patient
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating patient', error: error.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting patient', error: error.message });
  }
};