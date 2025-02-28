// server/models/inventory.model.js
const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  medication: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true },
  batchNumber: { type: String, required: true },
  grnNumber: { type: String, required: true },  // Goods Receipt Note
  expiryDate: { type: Date, required: true },
  manufacturingDate: Date,
  quantityReceived: { type: Number, required: true },
  quantityRemaining: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  supplier: String,
  receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receivedDate: { type: Date, default: Date.now },
  location: { type: String, default: 'main-pharmacy' },
  status: { 
    type: String, 
    enum: ['active', 'low-stock', 'expired', 'recalled'], 
    default: 'active' 
  }
});

module.exports = mongoose.model('Inventory', InventorySchema);