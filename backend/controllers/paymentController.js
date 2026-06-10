const MpesaExpress = require('tajiri-mpesa-express')
const Order = require('../models/orderModel')

const mpesa = new MpesaExpress({
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  shortCode: process.env.MPESA_SHORTCODE,
  passKey: process.env.MPESA_PASSKEY,
  callbackUrl: process.env.MPESA_CALLBACK_URL,
  environment: process.env.MPESA_ENV
})

const initiatePayment = async (req, res) => {
  const { orderId, phone, amount } = req.body
  try {
    const response = await mpesa.stkPush({
      phone,
      amount,
      accountReference: orderId,
      transactionDesc: 'ShopEasy Order Payment'
    })
    res.json(response)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const paymentCallback = async (req, res) => {
  try {
    const { Body } = req.body
    const { stkCallback } = Body
    const { ResultCode, CallbackMetadata, CheckoutRequestID } = stkCallback

    if (ResultCode === 0) {
      const amount = CallbackMetadata.Item.find(i => i.Name === 'Amount')?.Value
      const mpesaCode = CallbackMetadata.Item.find(i => i.Name === 'MpesaReceiptNumber')?.Value
      const phone = CallbackMetadata.Item.find(i => i.Name === 'PhoneNumber')?.Value

      await Order.findOneAndUpdate(
        { _id: req.body.accountReference },
        { isPaid: true, paidAt: Date.now(), mpesaCode }
      )
    }
    res.json({ ResultCode: 0, ResultDesc: 'Success' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { initiatePayment, paymentCallback }