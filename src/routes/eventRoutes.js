const express = require('express');
const { createEvent, getEvents, getUserEvents } = require('../controllers/eventControllers');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, restrictTo('admin'), createEvent);

router.get('/', protect, getEvents);

router.get('/userEvents', protect, getUserEvents);

module.exports = router; 
