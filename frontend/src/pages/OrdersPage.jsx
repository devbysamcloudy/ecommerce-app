import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../config'
import { useAuth } from '../context/AuthContext'

function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { userInfo } = useAuth()

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
      return
    }
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/orders/myorders`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`
            }
          }
        )
        setOrders(data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  return (
    <div className='bg-gray-100 min-h-screen p-8'>
      <h2 className='text-3xl font-bold mb-8 text-gray-800'>My Orders</h2>
      {loading ? (
        <p className='text-center text-gray-500'>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className='text-center text-gray-500'>You have no orders yet</p>
      ) : (
        <div className='max-w-3xl mx-auto space-y-4'>
          {orders.map(order => (
            <div key={order._id} className='bg-white rounded-lg shadow-md p-6'>
              <div className='flex justify-between items-center mb-4'>
                <p className='text-gray-500 text-sm'>Order ID: {order._id}</p>
                <p className='text-gray-500 text-sm'>
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              {order.orderItems.map(item => (
                <div key={item._id} className='flex justify-between border-b border-gray-200 py-2'>
                  <p className='text-gray-800'>{item.name}</p>
                  <p className='text-gray-500'>x{item.quantity}</p>
                  <p className='text-blue-600 font-bold'>${item.price * item.quantity}</p>
                </div>
              ))}
              <div className='flex justify-between items-center mt-4'>
                <p className='font-bold text-gray-800'>Total</p>
                <p className='font-bold text-blue-600'>${order.totalPrice}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersPage