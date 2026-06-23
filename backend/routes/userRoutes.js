const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  registerUser,
  loginUser,
  checkEmailExists,
  checkEmailDomain,
  verifyOTP,      
  resendOTP,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount
} = require('../controllers/userController');

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.get('/check-email', checkEmailExists);        // public  — GET with ?email=
router.get('/check-email-domain', checkEmailDomain)
router.post('/verify-otp', verifyOTP)
router.post('/resend-otp', resendOTP)
router.get('/profile', protect, getUserProfile);     // private — needs token
router.put('/profile', protect, updateUserProfile);  // private — needs token
router.delete('/profile', protect, deleteUserAccount)


module.exports = router;