import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import API_URL from '../config'

function CheckoutPage({ cart, setCart }) {
  const navigate = useNavigate()
  const { userInfo } = useAuth()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [orderId, setOrderId] = useState(null)
  const [orderTotal, setOrderTotal] = useState(0) 

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

  useEffect(() => {
    if (cart.length === 0 && !orderId) navigate('/')
  }, [cart, navigate, orderId])

  const placeOrderHandler = async () => {
    if (!userInfo) { navigate('/login'); return }
    try {
      setLoading(true)
      const { data } = await axios.post(
        `${API_URL}/api/orders`,
        {
          orderItems: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            product: item._id
          })),
          totalPrice: total
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      )
      setOrderId(data._id)
      setOrderTotal(total)   // ✅ save before clearing cart
      setCart([])
      setLoading(false)
    } catch (error) {
      alert('Order failed. Please try again.')
      setLoading(false)
    }
  }

  const paymentHandler = async () => {
    if (!phone) { alert('Please enter your M-Pesa phone number'); return }
    try {
      setLoading(true)
      setMessage('')
      await axios.post(
        `${API_URL}/api/payments/initiate`,
        { orderId, phone, amount: orderTotal },  // ✅ use orderTotal
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      )
      setMessage('STK Push sent! Check your phone and enter your M-Pesa PIN.')
      setLoading(false)
    } catch (error) {
      setMessage('Payment failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className='bg-gray-100 min-h-screen p-8'>
      <h2 className='text-3xl font-bold mb-8 text-gray-800'>Checkout</h2>
      <div className='max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6'>

        {!orderId ? (
          <>
            <h3 className='text-xl font-bold mb-4 text-gray-800'>Order Summary</h3>
            {cart.map(item => (
              <div key={item._id} className='flex justify-between items-center border-b border-gray-200 py-4'>
                <p className='font-semibold text-gray-800'>{item.name}</p>
                <p className='text-gray-500'>x{item.quantity}</p>
                <p className='text-blue-600 font-bold'>KES {item.price * item.quantity}</p>
              </div>
            ))}
            <div className='flex justify-between items-center mt-6'>
              <h3 className='text-xl font-bold text-gray-800'>Total</h3>
              <h3 className='text-xl font-bold text-blue-600'>KES {total}</h3>
            </div>
            <button
              onClick={placeOrderHandler}
              disabled={loading}
              className='w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded font-semibold mt-6 disabled:opacity-50'
            >
              {loading ? 'Processing...' : 'Confirm Order'}
            </button>
          </>
        ) : (
          <>
            <h3 className='text-xl font-bold mb-2 text-gray-800'>Pay with M-Pesa</h3>
            <p className='text-gray-500 mb-6'>Order ID: {orderId}</p>
            <p className='text-2xl font-bold text-green-600 mb-6'>Total: KES {orderTotal}</p>  {/* ✅ */}
            {message && (
              <p className={`mb-4 font-semibold ${message.includes('STK') ? 'text-green-500' : 'text-red-500'}`}>
                {message}
              </p>
            )}
            <input
              type='text'
              placeholder='Enter M-Pesa phone (e.g. 0712345678)'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className='w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500'
            />
            <button
              onClick={paymentHandler}
              disabled={loading}
              className='w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded font-semibold disabled:opacity-50'
            >
              {loading ? 'Sending STK Push...' : 'Pay with M-Pesa'}
            </button>
            <button
              onClick={() => navigate('/orders')}
              className='w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded font-semibold mt-3'
            >
              View My Orders
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default CheckoutPage