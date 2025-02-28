// server/routes/inventory.routes.js
const express = require('express');
const inventoryController = require('../controllers/inventory.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all inventory items
router.get('/', authMiddleware, inventoryController.getAllInventory);

// Get inventory by medication ID
router.get('/medication/:medicationId', authMiddleware, inventoryController.getInventoryByMedication);

// Get single inventory item
router.get('/:id', authMiddleware, inventoryController.getInventoryById);

// Create new inventory item
router.post('/', authMiddleware, inventoryController.createInventory);

// Update inventory item
router.put('/:id', authMiddleware, inventoryController.updateInventory);

// Delete inventory item (admin only)
router.delete('/:id', [authMiddleware, roleMiddleware('admin')], inventoryController.deleteInventory);

module.exports = router;