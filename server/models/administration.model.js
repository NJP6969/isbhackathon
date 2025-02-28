// server/models/administration.model.js
const mongoose = require('mongoose');

const AdministrationSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  prescription: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' },
  medication: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true },
  inventory: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
  dosage: { type: String, required: true },
  route: { type: String, required: true },
  administeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  administeredAt: { type: Date, default: Date.now },
  wasWitnessed: { type: Boolean, default: false },
  witnessedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  patientResponse: String,
  notes: String
});

module.exports = mongoose.model('Administration', AdministrationSchema);