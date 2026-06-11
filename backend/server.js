const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const productRoutes = require("./routes/productRoutes")
const userRoutes = require("./routes/userRoutes")
const orderRoutes = require('./routes/orderRoutes')
const superAdminRoutes = require('./routes/superAdminRoutes')
const { apiLimiter } = require('./middleware/rateLimiter');
const paymentRoutes = require('./routes/paymentRoutes')

dotenv.config()

const app = express()
app.set('trust proxy', 1)

// CORS before everything
app.use(cors({ origin: '*' }))
app.use(express.json())

app.use('/api', apiLimiter)               

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/superadmin', superAdminRoutes)
app.use('/api/payments', paymentRoutes)

const PORT = process.env.PORT || 5000

// Connect DB then start server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}).catch(err => {
  console.error("DB connection failed:", err.message)
  process.exit(1)
})