import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../config'
import { useAuth } from '../context/AuthContext'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

function AdminPage() {
  const navigate = useNavigate()
  const { userInfo } = useAuth()

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    if (!userInfo) { navigate('/login'); return }
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/products`)
      setProducts(data)
    } catch {
      setDeleteError('Failed to load products.')
    } finally {
      setLoadingProducts(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const uploadToCloudinary = async () => {
    if (!imageFile) return image // use existing URL if no file selected
    const formData = new FormData()
    formData.append('file', imageFile)
    formData.append('upload_preset', UPLOAD_PRESET)
    setUploading(true)
    try {
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      )
      return data.secure_url
    } finally {
      setUploading(false)
    }
  }

  const submitHandler = async () => {
    if (!userInfo) { navigate('/login'); return }
    try {
      setError('')
      setSuccess('')
      const imageUrl = await uploadToCloudinary()
      await axios.post(
        `${API_URL}/api/products`,
        { name, price, description, image: imageUrl, category, countInStock },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      )
      setSuccess('Product added successfully!')
      setName(''); setPrice(''); setDescription('')
      setImage(''); setImageFile(null); setImagePreview('')
      setCategory(''); setCountInStock('')
      fetchProducts()
    } catch {
      setError('Failed to add product.')
    }
  }

  const deleteHandler = async (id) => {
  if (!window.confirm('Remove this product?')) return
  
  try {
    await axios.delete(`${API_URL}/api/products/${id}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` }
    })
    // Success - remove from local state
    setProducts(products.filter(p => p._id !== id))
    setDeleteError('')
  } catch (error) {
    // If product not found (404) or any other error, remove from local state anyway
    if (error.response?.status === 404) {
      console.log('Product already removed from server')
    }
    // Remove from local state regardless of error
    setProducts(products.filter(p => p._id !== id))
    setDeleteError('Product removed from list')
    setTimeout(() => setDeleteError(''), 3000)
  }
}

  return (
    <div className='bg-gray-100 min-h-screen p-8'>

      {/* Add Product Form */}
      <div className='max-w-lg mx-auto bg-white rounded-lg shadow-md p-8 mb-10'>
        <h2 className='text-2xl font-bold mb-6 text-gray-800'>Add New Product</h2>
        {success && <p className='text-green-500 mb-4'>{success}</p>}
        {error && <p className='text-red-500 mb-4'>{error}</p>}

        <input type='text' placeholder='Name' value={name} onChange={e => setName(e.target.value)}
          className='w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500' />
        <input type='number' placeholder='Price' value={price} onChange={e => setPrice(e.target.value)}
          className='w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500' />
        <input type='text' placeholder='Description' value={description} onChange={e => setDescription(e.target.value)}
          className='w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500' />
        <input type='text' placeholder='Category' value={category} onChange={e => setCategory(e.target.value)}
          className='w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500' />
        <input type='number' placeholder='Count In Stock' value={countInStock} onChange={e => setCountInStock(e.target.value)}
          className='w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500' />

        {/* Image upload */}
        <label className='block text-sm text-gray-600 mb-1'>Product Image</label>
        <input type='file' accept='image/*' onChange={handleImageChange}
          className='w-full border border-gray-300 rounded px-4 py-2 mb-2 focus:outline-none' />
        {imagePreview && (
          <img src={imagePreview} alt='preview' className='w-full h-48 object-cover rounded mb-4' />
        )}

        <button onClick={submitHandler} disabled={uploading}
          className='w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold disabled:opacity-50'>
          {uploading ? 'Uploading image...' : 'Add Product'}
        </button>
      </div>

      {/* Product List */}
      <div className='max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8'>
        <h2 className='text-2xl font-bold mb-6 text-gray-800'>Manage Products</h2>
        {deleteError && <p className='text-red-500 mb-4'>{deleteError}</p>}
        {loadingProducts ? (
          <p className='text-gray-500'>Loading products...</p>
        ) : products.length === 0 ? (
          <p className='text-gray-500'>No products found.</p>
        ) : (
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b text-left text-gray-600'>
                <th className='pb-3'>Image</th>
                <th className='pb-3'>Name</th>
                <th className='pb-3'>Price</th>
                <th className='pb-3'>Stock</th>
                <th className='pb-3'>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} className={`border-b ${p.countInStock === 0 ? 'bg-red-50' : ''}`}>
                  <td className='py-3'>
                    <img src={p.image} alt={p.name} className='w-12 h-12 object-cover rounded' />
                  </td>
                  <td className='py-3 font-medium'>{p.name}</td>
                  <td className='py-3'>${p.price}</td>
                  <td className='py-3'>
                    {p.countInStock === 0
                      ? <span className='text-red-500 font-semibold'>Sold Out</span>
                      : p.countInStock}
                  </td>
                  <td className='py-3'>
                    <button onClick={() => deleteHandler(p._id)}
                      className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs'>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}

export default AdminPage