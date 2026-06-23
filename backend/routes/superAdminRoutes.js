const express = require('express')
const router = express.Router()
const { getAllUsers, promoteUser, demoteUser, createAdmin  } = require('../controllers/superAdminController')
const { protect, superAdminOnly } = require('../middleware/authMiddleware')
const { deleteUser } = require('../controllers/superAdminController')

router.get('/users', protect, superAdminOnly, getAllUsers)
router.put('/promote/:id', protect, superAdminOnly, promoteUser)
router.put('/demote/:id', protect, superAdminOnly, demoteUser)
router.post('/create-admin', protect, superAdminOnly, createAdmin)
router.delete('/users/:id', protect, deleteUser)

module.exports = router