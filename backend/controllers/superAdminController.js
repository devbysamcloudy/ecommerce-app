const User = require('../models/userModel')
const bcrypt = require('bcryptjs')

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Promote user to admin
const promoteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    user.isAdmin = true
    user.role = 'admin'
    await user.save()
    res.json({ message: `${user.name} promoted to admin successfully` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Demote admin to user
const demoteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    user.isAdmin = false
    user.role = 'user'
    await user.save()
    res.json({ message: `${user.name} demoted to user successfully` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
const createAdmin = async (req, res) => {
  const { name, email, password } = req.body
  try {
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
      role: 'admin'
    })
    res.status(201).json({ message: `Admin ${name} created successfully` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc   Delete a user
// @route  DELETE /api/superadmin/users/:id
// @access SuperAdmin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found.' })
    if (user.isSuperAdmin) {
      return res.status(403).json({ message: 'Cannot delete a super admin.' })
    }
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'User deleted successfully.' })
  } catch (error) {
    res.status(500).json({ message: 'Server error.' })
  }
}

module.exports = { getAllUsers, promoteUser, demoteUser, createAdmin, deleteUser }
