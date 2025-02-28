// server/models/patient.model.js
const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  mrn: { type: String, required: true, unique: true }, // Medical Record Number
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  contactNumber: String,
  email: String,
  address: String,
  allergies: [String],
  medicalHistory: [String],
  admissionDate: Date,
  dischargeDate: Date,
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Patient', PatientSchema);