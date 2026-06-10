const express = require('express')
const router = express.Router()
const { initiatePayment, paymentCallback } = require('../controllers/paymentController')
const { protect } = require('../middleware/authMiddleware')

router.post('/initiate', protect, initiatePayment)
router.post('/callback', paymentCallback)

module.exports = router