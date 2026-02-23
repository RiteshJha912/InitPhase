const express = require('express');
const { createProject, getUserProjects, getSingleProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createProject);
router.get('/', protect, getUserProjects);
router.get('/:id', protect, getSingleProject);

module.exports = router;
