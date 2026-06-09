import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'

function CheckoutPage({ cart, setCart }) {
  const navigate = useNavigate()
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/')
    }
  }, [cart, navigate])

  const placeOrderHandler = async () => {
    if (!userInfo) {
      navigate('/login')
      return
    }
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/orders',
        {
          orderItems: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            product: item._id
          })),
          totalPrice: total
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      )
      setCart([])
      navigate('/')
      alert(`Order placed successfully! Order ID: ${data._id}`)
    } catch (error) {
      alert('Order failed. Please try again.')
    }
  }

  return (
    <div className='bg-gray-100 min-h-screen p-8'>
      <h2 className='text-3xl font-bold mb-8 text-gray-800'>Order Summary</h2>
      <div className='max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6'>
        {cart.map(item => (
          <div key={item._id} className='flex justify-between items-center border-b border-gray-200 py-4'>
            <p className='font-semibold text-gray-800'>{item.name}</p>
            <p className='text-gray-500'>x{item.quantity}</p>
            <p className='text-blue-600 font-bold'>${item.price * item.quantity}</p>
          </div>
        ))}
        <div className='flex justify-between items-center mt-6'>
          <h3 className='text-xl font-bold text-gray-800'>Total</h3>
          <h3 className='text-xl font-bold text-blue-600'>${total}</h3>
        </div>
        <button
          onClick={placeOrderHandler}
          className='w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded font-semibold mt-6'
        >
          Place Order
        </button>
      </div>
    </div>
  )
}

export default CheckoutPage