const express = require('express')
const router = express.Router()
const { getAllUsers, promoteUser, demoteUser, createAdmin  } = require('../controllers/superAdminController')
const { protect, superAdminOnly } = require('../middleware/authMiddleware')

router.get('/users', protect, superAdminOnly, getAllUsers)
router.put('/promote/:id', protect, superAdminOnly, promoteUser)
router.put('/demote/:id', protect, superAdminOnly, demoteUser)
router.post('/create-admin', protect, superAdminOnly, createAdmin)

module.exports = router