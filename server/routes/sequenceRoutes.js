const express = require('express');
const router = express.Router();
const {
  createSequenceFlow,
  getProjectSequenceFlows,
  deleteSequenceFlow,
} = require('../controllers/sequenceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:projectId', protect, createSequenceFlow);
router.get('/:projectId', protect, getProjectSequenceFlows);
router.delete('/:id', protect, deleteSequenceFlow);

module.exports = router;
