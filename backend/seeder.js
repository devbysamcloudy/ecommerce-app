const dotenv = require('dotenv')
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const Product = require('./models/productModel')

dotenv.config()
connectDB()

const products = [
  {
    name: 'Nike Air Max',
    price: 150,
    description: 'Comfortable running shoes',
    image: 'https://via.placeholder.com/150',
    category: 'Shoes',
    countInStock: 10
  },
  {
    name: 'Samsung TV 55"',
    price: 800,
    description: '4K Ultra HD Smart TV',
    image: 'https://via.placeholder.com/150',
    category: 'Electronics',
    countInStock: 5
  }
]

const seedProducts = async () => {
  try {
    await Product.deleteMany({})
    await Product.insertMany(products)
    console.log('Products seeded successfully!')
    process.exit()
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

seedProducts()