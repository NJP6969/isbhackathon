// server/controllers/inventory.controller.js
const Inventory = require('../models/inventory.model');

exports.getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find()
      .populate('medication', 'name dosageForm strength');
    
    res.status(200).json({ inventory });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory', error: error.message });
  }
};

exports.getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id)
      .populate('medication');
    
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    
    res.status(200).json({ inventory });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory item', error: error.message });
  }
};

exports.getInventoryByMedication = async (req, res) => {
  try {
    const inventory = await Inventory.find({ 
      medication: req.params.medicationId,
      quantityRemaining: { $gt: 0 }
    }).populate('medication');
    
    res.status(200).json({ inventory });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medication inventory', error: error.message });
  }
};

exports.createInventory = async (req, res) => {
  try {
    const inventory = new Inventory(req.body);
    
    // Add the user who received the inventory
    inventory.receivedBy = req.userId;
    
    await inventory.save();
    
    res.status(201).json({ 
      message: 'Inventory added successfully', 
      inventory 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding inventory', error: error.message });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    
    res.status(200).json({
      message: 'Inventory updated successfully',
      inventory
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating inventory', error: error.message });
  }
};

exports.deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndDelete(req.params.id);
    
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    
    res.status(200).json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting inventory', error: error.message });
  }
};