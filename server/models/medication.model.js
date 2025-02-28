// server/models/medication.model.js
const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genericName: String,
  dosageForm: { type: String, required: true }, // tablet, syrup, injection, etc.
  strength: { type: String, required: true },   // 500mg, 250ml, etc.
  manufacturer: String,
  category: { 
    type: String, 
    enum: ['antibiotic', 'analgesic', 'antihistamine', 'antihypertensive', 'other'] 
  },
  requiresPrescription: { type: Boolean, default: true },
  sideEffects: [String],
  contraindications: [String],
  storageConditions: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Medication', MedicationSchema);