const axios = require('axios')
const Order = require('../models/orderModel')

// Generate M-Pesa access token
const getToken = async () => {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64')

  const { data } = await axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    { headers: { Authorization: `Basic ${auth}` } }
  )
  return data.access_token
}

// Generate password and timestamp
const getPasswordAndTimestamp = () => {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-T:.Z]/g, '')
    .slice(0, 14)

  const password = Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString('base64')

  return { password, timestamp }
}

// Format phone: 07XXXXXXXX → 2547XXXXXXXX
const formatPhone = (phone) => {
  phone = phone.trim()
  if (phone.startsWith('0')) return '254' + phone.slice(1)
  if (phone.startsWith('+')) return phone.slice(1)
  return phone
}

const initiatePayment = async (req, res) => {
  const { orderId, phone, amount } = req.body

  try {
    const token = await getToken()
    const { password, timestamp } = getPasswordAndTimestamp()
    const formattedPhone = formatPhone(phone)

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.ceil(amount),           // M-Pesa requires whole numbers
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: orderId,
      TransactionDesc: 'ShopEasy Order Payment'
    }

    const { data } = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    console.log('STK Push response:', data)
    res.json(data)
  } catch (error) {
    console.error('STK Push error:', error.response?.data || error.message)
    res.status(500).json({ message: error.response?.data || error.message })
  }
}

const paymentCallback = async (req, res) => {
  try {
    const { Body } = req.body
    const { stkCallback } = Body
    const { ResultCode, CallbackMetadata } = stkCallback

    if (ResultCode === 0) {
      const amount = CallbackMetadata.Item.find(i => i.Name === 'Amount')?.Value
      const mpesaCode = CallbackMetadata.Item.find(i => i.Name === 'MpesaReceiptNumber')?.Value

      await Order.findByIdAndUpdate(
        stkCallback.AccountReference,
        { isPaid: true, paidAt: Date.now(), mpesaCode }
      )
    }

    res.json({ ResultCode: 0, ResultDesc: 'Success' })
  } catch (error) {
    console.error('Callback error:', error.message)
    res.status(500).json({ message: error.message })
  }
}

module.exports = { initiatePayment, paymentCallback }