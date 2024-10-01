const express = require('express');
const { createEvent, getEvents, joinEvent } = require('../controllers/eventControllers');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, restrictTo('admin'), createEvent);

router.get('/', protect, getEvents);

module.exports = router; 
