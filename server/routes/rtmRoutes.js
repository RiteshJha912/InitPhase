const express = require('express');
const { getRTMAggregation } = require('../controllers/rtmController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:projectId', protect, getRTMAggregation);

module.exports = router;
