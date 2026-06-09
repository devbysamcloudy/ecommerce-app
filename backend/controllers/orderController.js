const Order = require('../models/orderModel')
const Product = require('../models/productModel')

const createOrder = async (req, res) => {
  const { orderItems, totalPrice } = req.body

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' })
  }

  try {
    // Check stock and reduce it
    for (const item of orderItems) {
      const product = await Product.findById(item.product)
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` })
      }
      if (product.countInStock < item.quantity) {
        return res.status(400).json({ message: `${product.name} is out of stock` })
      }
      product.countInStock -= item.quantity
      await product.save()
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      totalPrice
    })
    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { createOrder, getMyOrders }