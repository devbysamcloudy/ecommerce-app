import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../config'

function AdminPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null

  const submitHandler = async () => {
    if (!userInfo) {
      navigate('/login')
      return
    }
    try {
      await axios.post(
        `${API_URL}/api/products`,
        { name, price, description, image, category, countInStock },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      )
      setSuccess('Product added successfully!')
      setName(''); setPrice(''); setDescription('')
      setImage(''); setCategory(''); setCountInStock('')
    } catch (error) {
      setError('Failed to add product.')
    }
  }

  return (
    <div className='bg-gray-100 min-h-screen p-8'>
      <div className='max-w-lg mx-auto bg-white rounded-lg shadow-md p-8'>
        <h2 className='text-2xl font-bold mb-6 text-gray-800'>Add New Product</h2>
        {success && <p className='text-green-500 mb-4'>{success}</p>}
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        {['name', 'price', 'description', 'image', 'category', 'countInStock'].map(field => (
          <input
            key={field}
            type={field === 'price' || field === 'countInStock' ? 'number' : 'text'}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={eval(field)}
            onChange={(e) => {
              const setters = { name: setName, price: setPrice, description: setDescription, image: setImage, category: setCategory, countInStock: setCountInStock }
              setters[field](e.target.value)
            }}
            className='w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        ))}
        <button
          onClick={submitHandler}
          className='w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold'
        >
          Add Product
        </button>
      </div>
    </div>
  )
}

export default AdminPage