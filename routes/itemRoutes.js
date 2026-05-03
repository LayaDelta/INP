const express = require('express');
const router = express.Router();
const {
  createComponent,
  getComponents,
  getComponentById,
  updateComponent,
  deleteComponent
} = require('../controllers/itemController');

// Define routes for /api/components
router.post('/', createComponent);            // Create
router.get('/', getComponents);               // Read All
router.get('/:id', getComponentById);         // Read Single
router.put('/:id', updateComponent);          // Update
router.delete('/:id', deleteComponent);       // Delete

module.exports = router;
