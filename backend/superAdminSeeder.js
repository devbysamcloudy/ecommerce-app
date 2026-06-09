const dotenv = require('dotenv')
const connectDB = require('./config/db')
const User = require('./models/userModel')
const bcrypt = require('bcryptjs')

dotenv.config()
connectDB()

const createSuperAdmin = async () => {
  try {
    const exists = await User.findOne({ email: 'superadmin@shopeasy.com' })
    if (exists) {
      console.log('Super admin already exists')
      process.exit()
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('superadmin123', salt)

    await User.create({
      name: 'Super Admin',
      email: 'superadmin@shopeasy.com',
      password: hashedPassword,
      isAdmin: true,
      isSuperAdmin: true,
      role: 'superAdmin'
    })

    console.log('Super admin created successfully!')
    process.exit()
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

createSuperAdmin()