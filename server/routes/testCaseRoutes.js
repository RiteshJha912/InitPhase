const express = require('express');
const { createTestCase, getProjectTestCases, updateTestStatus } = require('../controllers/testCaseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:projectId/:requirementId', protect, createTestCase);
router.get('/:projectId', protect, getProjectTestCases);
router.patch('/:id/status', protect, updateTestStatus);

module.exports = router;
