const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  registerUser,
  loginUser,
  checkEmailExists,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.get('/check-email', checkEmailExists);        // public  — GET with ?email=
router.get('/profile', protect, getUserProfile);     // private — needs token
router.put('/profile', protect, updateUserProfile);  // private — needs token

module.exports = router;