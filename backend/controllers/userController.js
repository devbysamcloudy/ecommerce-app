const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dns = require('dns').promises
const { sendOTPEmail } = require('../utils/mailer')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// @desc   Register user
// @route  POST /api/users/register
// @access Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body
  try {
    const userExists = await User.findOne({ email: email.toLowerCase().trim() })
    if (userExists) {
      return res.status(409).json({ message: 'Email already in use.' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpiry
    })

        try {
          await sendOTPEmail(user.email, otp)
        } catch (emailError) {
          console.error('Email send failed:', emailError.message) 
          console.log(`OTP for ${user.email}: ${otp}`)
        }

    res.status(201).json({
      message: 'Registration successful. Check your email for the OTP.',
      userId: user._id
    })
  } catch (error) {
    console.error('Register error:', error.message)
    res.status(500).json({ message: 'Server error.' })
  }
}

// @desc   Login user
// @route  POST /api/users/login
// @access Public
const loginUser = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }
    if (!user.isVerified && !user.isSuperAdmin) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' })
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
      role: user.role,
      token: generateToken(user._id)
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error.' })
  }
}

// @desc   Check if email exists
// @route  GET /api/users/check-email?email=
// @access Public
const checkEmailExists = async (req, res) => {
  try {
    const { email } = req.query
    if (!email) return res.status(400).json({ message: 'Email is required.' })
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    return res.status(200).json({ exists: !!user })
  } catch (error) {
    res.status(500).json({ message: 'Server error.' })
  }
}

// @desc   Check if email domain has valid MX records
// @route  GET /api/users/check-email-domain?email=
// @access Public
const checkEmailDomain = async (req, res) => {
  const { email } = req.query
  if (!email) return res.status(400).json({ message: 'Email is required.' })
  const domain = email.split('@')[1]
  if (!domain) return res.status(400).json({ valid: false })
  try {
    const records = await dns.resolveMx(domain)
    return res.status(200).json({ valid: records && records.length > 0 })
  } catch {
    return res.status(200).json({ valid: false })
  }
}

// @desc   Verify OTP
// @route  POST /api/users/verify-otp
// @access Public
const verifyOTP = async (req, res) => {
  const { userId, otp } = req.body
  try {
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: 'User not found.' })
    if (user.isVerified) return res.status(400).json({ message: 'Account already verified.' })
    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' })
    }
    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' })
    }

    user.isVerified = true
    user.otp = null
    user.otpExpiry = null
    await user.save()

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
      role: user.role,
      token: generateToken(user._id)
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error.' })
  }
}

// @desc   Resend OTP
// @route  POST /api/users/resend-otp
// @access Public
const resendOTP = async (req, res) => {
  const { userId } = req.body
  try {
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: 'User not found.' })
    if (user.isVerified) return res.status(400).json({ message: 'Account already verified.' })

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    user.otp = otp
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
    await user.save()

    try {
      await sendOTPEmail(user.email, otp)
    } catch (emailError) {
      console.log(`OTP for ${user.email}: ${otp}`)
    }

    res.json({ message: 'New OTP sent to your email.' })
  } catch (error) {
    res.status(500).json({ message: 'Server error.' })
  }
}

// @desc   Get logged-in user profile
// @route  GET /api/users/profile
// @access Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found.' })
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: 'Server error.' })
  }
}

// @desc   Update logged-in user profile
// @route  PUT /api/users/profile
// @access Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found.' })

    const { name, phone, address, avatar, password } = req.body

    if (name) user.name = name
    if (phone) user.phone = phone
    if (avatar) user.avatar = avatar
    if (address) user.address = { ...(user.address || {}), ...address }

    if (password) {
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)
    }

    const updatedUser = await user.save()

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      avatar: updatedUser.avatar,
      isAdmin: updatedUser.isAdmin,
      isSuperAdmin: updatedUser.isSuperAdmin,
      role: updatedUser.role,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error.' })
  }
}

module.exports = {
  registerUser,
  loginUser,
  checkEmailExists,
  checkEmailDomain,
  verifyOTP,
  resendOTP,
  getUserProfile,
  updateUserProfile
}