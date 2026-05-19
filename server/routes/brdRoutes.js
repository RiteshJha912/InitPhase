const express = require('express');
const {
  generateBrdDraft,
  createBrd,
  getProjectBrds,
  getBrdById,
  deleteBrd,
  convertBrdRequirements,
} = require('../controllers/brdController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:projectId/generate', protect, generateBrdDraft);
router.route('/:projectId').get(protect, getProjectBrds).post(protect, createBrd);
router.get('/detail/:id', protect, getBrdById);
router.delete('/:id', protect, deleteBrd);
router.post('/:id/convert-requirements', protect, convertBrdRequirements);

module.exports = router;
