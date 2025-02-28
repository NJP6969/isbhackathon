// server/models/prescription.model.js
const mongoose = require('mongoose');

const MedicationOrderSchema = new mongoose.Schema({
  medication: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  route: { type: String, required: true }, // oral, IV, etc.
  duration: String,
  specialInstructions: String,
  status: { 
    type: String, 
    enum: ['pending', 'dispensed', 'administered', 'cancelled'], 
    default: 'pending' 
  }
});

const PrescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  diagnosis: String,
  medications: [MedicationOrderSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'cancelled'], 
    default: 'active' 
  },
  notes: String
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);