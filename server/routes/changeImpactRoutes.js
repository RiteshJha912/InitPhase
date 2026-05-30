const express = require('express');
const {
  analyzeRepository,
  deleteImpactAnalysis,
  generateImpactDraft,
  getProjectChangeImpact,
  saveImpactAnalysis,
} = require('../controllers/changeImpactController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:projectId', protect, getProjectChangeImpact);
router.post('/:projectId/repository', protect, analyzeRepository);
router.post('/:projectId/generate', protect, generateImpactDraft);
router.post('/:projectId/analyses', protect, saveImpactAnalysis);
router.delete('/:projectId/analyses/:analysisId', protect, deleteImpactAnalysis);

module.exports = router;
