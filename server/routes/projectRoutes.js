const express = require('express');
const { createProject, getUserProjects, getSingleProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createProject);
router.get('/', protect, getUserProjects);
router.get('/:id', protect, getSingleProject);
router.patch('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);
router.use('/:projectId/documentation', require('./documentationRoutes'));

module.exports = router;
