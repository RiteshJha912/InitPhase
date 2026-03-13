const express = require('express');
const { getDocumentation } = require('../controllers/documentationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router.get('/', protect, getDocumentation);

module.exports = router;
