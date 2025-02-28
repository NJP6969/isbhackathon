// server/controllers/medication.controller.js
const Medication = require('../models/medication.model');

exports.getAllMedications = async (req, res) => {
  try {
    const medications = await Medication.find();
    res.status(200).json({ medications });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medications', error: error.message });
  }
};

exports.getMedicationById = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    res.status(200).json({ medication });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medication', error: error.message });
  }
};

exports.createMedication = async (req, res) => {
  try {
    const medication = new Medication(req.body);
    await medication.save();
    res.status(201).json({ message: 'Medication created successfully', medication });
  } catch (error) {
    res.status(500).json({ message: 'Error creating medication', error: error.message });
  }
};

exports.updateMedication = async (req, res) => {
  try {
    const medication = await Medication.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    res.status(200).json({ message: 'Medication updated successfully', medication });
  } catch (error) {
    res.status(500).json({ message: 'Error updating medication', error: error.message });
  }
};

exports.deleteMedication = async (req, res) => {
  try {
    const medication = await Medication.findByIdAndDelete(req.params.id);
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    res.status(200).json({ message: 'Medication deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting medication', error: error.message });
  }
};