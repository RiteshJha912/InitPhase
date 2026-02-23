const express = require('express');
const { createRequirement, getProjectRequirements, deleteRequirement } = require('../controllers/requirementController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:projectId', protect, createRequirement);
router.get('/:projectId', protect, getProjectRequirements);
router.delete('/:id', protect, deleteRequirement);

module.exports = router;
