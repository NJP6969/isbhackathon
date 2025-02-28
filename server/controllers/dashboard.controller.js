// server/controllers/dashboard.controller.js
const Patient = require('../models/patient.model');
const Prescription = require('../models/prescription.model');
const Administration = require('../models/administration.model');
const Inventory = require('../models/inventory.model');

exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Get active patients (patients without a discharge date or with future discharge date)
    const activePatients = await Patient.countDocuments({
      $or: [
        { dischargeDate: { $exists: false } },
        { dischargeDate: null },
        { dischargeDate: { $gt: now } }
      ]
    });

    // Get pending prescriptions
    const pendingPrescriptions = await Prescription.countDocuments({
      status: 'active'
    });

    // Get medications administered today
    const medicationsAdministered = await Administration.countDocuments({
      administeredAt: { $gte: today }
    });

    // Get alerts (low stock, expiring soon, expired medications)
    const inventoryAlerts = await Inventory.countDocuments({
      $or: [
        { status: 'low-stock' },
        { status: 'expired' },
        { expiryDate: { $lt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) } } // 30 days from now
      ]
    });

    res.status(200).json({
      activePatients,
      pendingPrescriptions,
      medicationsAdministered,
      alerts: inventoryAlerts
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching dashboard data', 
      error: error.message 
    });
  }
};