const express = require('express');
const router = express.Router();
const {
  createIssue,
  getProjectIssues,
  updateIssueStatus,
  deleteIssue,
} = require('../controllers/issueController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:projectId').get(protect, getProjectIssues).post(protect, createIssue);
router.route('/:id').delete(protect, deleteIssue);
router.route('/:id/status').patch(protect, updateIssueStatus);

module.exports = router;
