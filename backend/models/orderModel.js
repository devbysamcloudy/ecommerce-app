const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  orderItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' }
    }
  ],
  totalPrice: { type: Number, required: true, default: 0.0 },
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  mpesaCode: { type: String },
  isDelivered: { type: Boolean, required: true, default: false },
  deliveredAt: { type: Date }
}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
