import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../config'
import { useAuth } from '../context/AuthContext'

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  // Check email on blur (when user leaves the email field)
  const checkEmail = async () => {
    if (!email) return
    try {
      const { data } = await axios.get(`${API_URL}/api/users/check-email`, {
        params: { email }
      })
      if (data.exists) {
        setEmailError('This email is already registered.')
      } else {
        setEmailError('')
      }
    } catch {
      // silently fail — server will catch it on submit
    }
  }

  const submitHandler = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all fields.')
      return
    }
    if (emailError) return // block submit if email already taken

    try {
      setLoading(true)
      setError('')
      const { data } = await axios.post(`${API_URL}/api/users/register`, { name, email, password })
      login(data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Register</h2>
        {error && <p className='text-red-500 mb-4 text-center'>{error}</p>}
        <input
          type='text'
          placeholder='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
          onBlur={checkEmail}
          className={`w-full border rounded px-4 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            emailError ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {emailError && <p className='text-red-500 text-sm mb-3'>{emailError}</p>}
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full border border-gray-300 rounded px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <button
          onClick={submitHandler}
          disabled={loading || !!emailError}
          className='w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold disabled:opacity-50'
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        <p className='text-center mt-4 text-gray-600'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-500 hover:underline'>Login</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage