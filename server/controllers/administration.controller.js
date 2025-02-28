// server/controllers/administration.controller.js
const Administration = require('../models/administration.model');
const Inventory = require('../models/inventory.model');

exports.getAllAdministrations = async (req, res) => {
  try {
    const administrations = await Administration.find()
      .populate('patient', 'name mrn')
      .populate('medication', 'name dosageForm strength')
      .populate('administeredBy', 'name')
      .sort({ administeredAt: -1 });
    
    res.status(200).json({ administrations });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching administrations', error: error.message });
  }
};

exports.getAdministrationById = async (req, res) => {
  try {
    const administration = await Administration.findById(req.params.id)
      .populate('patient')
      .populate('prescription')
      .populate('medication')
      .populate('inventory')
      .populate('administeredBy', 'name')
      .populate('witnessedBy', 'name');
    
    if (!administration) {
      return res.status(404).json({ message: 'Administration record not found' });
    }
    
    res.status(200).json({ administration });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching administration record', error: error.message });
  }
};

exports.getAdministrationsByPatient = async (req, res) => {
  try {
    const administrations = await Administration.find({ patient: req.params.patientId })
      .populate('medication', 'name dosageForm strength')
      .populate('administeredBy', 'name')
      .sort({ administeredAt: -1 });
    
    res.status(200).json({ administrations });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient administrations', error: error.message });
  }
};

exports.createAdministration = async (req, res) => {
  try {
    const { patient, prescription, medication, inventory, dosage, route, wasWitnessed, witnessedBy, patientResponse, notes } = req.body;
    
    // Check inventory availability and decrement
    const inventoryItem = await Inventory.findById(inventory);
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    
    if (inventoryItem.quantityRemaining <= 0) {
      return res.status(400).json({ message: 'Medication out of stock' });
    }
    
    // Create administration record
    const administration = new Administration({
      patient,
      prescription,
      medication,
      inventory,
      dosage,
      route,
      administeredBy: req.userId,
      wasWitnessed,
      witnessedBy,
      patientResponse,
      notes
    });
    
    await administration.save();
    
    // Update inventory
    inventoryItem.quantityRemaining -= 1;
    if (inventoryItem.quantityRemaining <= 10 && inventoryItem.quantityRemaining > 0) {
      inventoryItem.status = 'low-stock';
    }
    await inventoryItem.save();
    
    res.status(201).json({
      message: 'Medication administration recorded successfully',
      administration
    });
  } catch (error) {
    res.status(500).json({ message: 'Error recording administration', error: error.message });
  }
};

exports.updateAdministration = async (req, res) => {
  try {
    const administration = await Administration.findById(req.params.id);
    if (!administration) {
      return res.status(404).json({ message: 'Administration record not found' });
    }
    
    // Only allow updates to certain fields after creation
    const { wasWitnessed, witnessedBy, patientResponse, notes } = req.body;
    
    if (wasWitnessed !== undefined) administration.wasWitnessed = wasWitnessed;
    if (witnessedBy) administration.witnessedBy = witnessedBy;
    if (patientResponse) administration.patientResponse = patientResponse;
    if (notes) administration.notes = notes;
    
    await administration.save();
    
    res.status(200).json({
      message: 'Administration record updated successfully',
      administration
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating administration record', error: error.message });
  }
};