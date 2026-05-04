const express = require('express');
const router = express.Router();
const {
  createComponent,
  getComponents,
  getComponentById,
  updateComponent,
  deleteComponent
} = require('../controllers/itemController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// Define routes for /api/components
router.post('/', requireAuth, requireAdmin, createComponent);            // Create
router.get('/', getComponents);               // Read All
router.get('/:id', getComponentById);         // Read Single
router.put('/:id', requireAuth, requireAdmin, updateComponent);          // Update
router.delete('/:id', requireAuth, requireAdmin, deleteComponent);       // Delete

module.exports = router;
