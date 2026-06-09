const dotenv = require('dotenv')
const connectDB = require('./config/db')
const User = require('./models/userModel')
const bcrypt = require('bcryptjs')

dotenv.config()
connectDB()

const createSuperAdmin = async () => {
  try {
    const exists = await User.findOne({ email: process.env.SUPER_ADMIN_EMAIL })
    if (exists) {
      console.log('Super admin already exists')
      process.exit()
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, salt)

    await User.create({
      name: process.env.SUPER_ADMIN_NAME,
      email: process.env.SUPER_ADMIN_EMAIL,
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