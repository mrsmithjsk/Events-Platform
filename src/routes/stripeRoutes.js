const express = require('express');
const { createCheckoutSession, paymentSuccess } = require('../controllers/stripeControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create-checkout-session', protect, createCheckoutSession);

router.get('/payment-success', protect, paymentSuccess);

module.exports = router;
