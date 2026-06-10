import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../config'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const submitHandler = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    try {
      setLoading(true)
      setError('')
      const { data } = await axios.post(`${API_URL}/api/users/login`, { email, password })
      login(data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>
        {error && <p className='text-red-500 mb-4 text-center'>{error}</p>}
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full border border-gray-300 rounded px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <button
          onClick={submitHandler}
          disabled={loading}
          className='w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold disabled:opacity-50'
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className='text-center mt-4 text-gray-600'>
          Don't have an account?{' '}
          <Link to='/register' className='text-blue-500 hover:underline'>Register</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage