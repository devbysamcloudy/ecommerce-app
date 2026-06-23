import { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '../config'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

function ProfilePage() {
  const { userInfo, login, logout } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [password, setPassword] = useState('')
  const [avatar, setAvatar] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        })
        setName(data.name || '')
        setPhone(data.phone || '')
        setStreet(data.address?.street || '')
        setCity(data.address?.city || '')
        setCountry(data.address?.country || '')
        setAvatar(data.avatar || '')
        setAvatarPreview(data.avatar || '')
      } catch (err) {
        if (err.response?.status === 401) { logout(); navigate('/login') }
      }
    }
    fetchProfile()
  }, [])

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const uploadAvatar = async () => {
    if (!avatarFile) return avatar
    const formData = new FormData()
    formData.append('file', avatarFile)
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
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      const avatarUrl = await uploadAvatar()
      const { data } = await axios.put(
        `${API_URL}/api/users/profile`,
        {
          name,
          phone,
          address: { street, city, country },
          avatar: avatarUrl,
          ...(password && { password }),
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      )
      login({ ...userInfo, name: data.name })
      setPassword('')
      setAvatarFile(null)
      setAvatar(avatarUrl)
      setSuccess('Profile updated successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.')
    } finally {
      setLoading(false)
    }
  }

  const deleteHandler = async () => {
  const confirmed = window.confirm(
    'Are you sure you want to delete your account? This action cannot be undone.'
  )
  if (!confirmed) return
  try {
    await axios.delete(`${API_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${userInfo.token}` }
    })
    logout()
    navigate('/')
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to delete account.')
  }
}

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>My Profile</h2>
        {success && <p className='text-green-500 mb-4 text-center'>{success}</p>}
        {error && <p className='text-red-500 mb-4 text-center'>{error}</p>}

        {/* Avatar */}
        <div className='flex flex-col items-center mb-6'>
          <img
            src={avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`}
            alt='avatar'
            className='w-24 h-24 rounded-full object-cover mb-3 border-4 border-blue-500'
          />
          <label className='cursor-pointer text-sm text-blue-500 hover:underline'>
            Change Photo
            <input type='file' accept='image/*' onChange={handleAvatarChange} className='hidden' />
          </label>
        </div>

        <label className='block text-sm text-gray-600 mb-1'>Name</label>
        <input type='text' value={name} onChange={e => setName(e.target.value)}
          className='w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500' />

        <label className='block text-sm text-gray-600 mb-1'>Phone</label>
        <input type='text' value={phone} onChange={e => setPhone(e.target.value)}
          className='w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500' />

        <label className='block text-sm text-gray-600 mb-1'>Street</label>
        <input type='text' value={street} onChange={e => setStreet(e.target.value)}
          className='w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500' />

        <label className='block text-sm text-gray-600 mb-1'>City</label>
        <input type='text' value={city} onChange={e => setCity(e.target.value)}
          className='w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500' />

        <label className='block text-sm text-gray-600 mb-1'>Country</label>
        <input type='text' value={country} onChange={e => setCountry(e.target.value)}
          className='w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500' />

        <label className='block text-sm text-gray-600 mb-1'>
          New Password <span className='text-gray-400'>(leave blank to keep current)</span>
        </label>
        <input type='password' value={password} onChange={e => setPassword(e.target.value)}
          className='w-full border border-gray-300 rounded px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500' />

        <button onClick={submitHandler} disabled={loading || uploading}
          className='w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold disabled:opacity-50'>
          {uploading ? 'Uploading photo...' : loading ? 'Saving...' : 'Save Changes'}
        </button>

        <button onClick={deleteHandler}
          className='w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded font-semibold mt-3'>
          Delete Account
        </button>
        
      </div>
    </div>
  )
}

export default ProfilePage