import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../config'
import { useAuth } from '../context/AuthContext'

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [emailChecking, setEmailChecking] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const checkEmail = async () => {
    if (!email) return

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.')
      return
    }

    try {
      setEmailChecking(true)
      setEmailError('')

      // 1. Check if already registered
      const { data: existsData } = await axios.get(`${API_URL}/api/users/check-email`, {
        params: { email }
      })
      if (existsData.exists) {
        setEmailError('This email is already registered.')
        return
      }

      // 2. Check if domain has real MX records
      const { data: domainData } = await axios.get(`${API_URL}/api/users/check-email-domain`, {
        params: { email }
      })
      if (!domainData.valid) {
        setEmailError('This email domain does not exist or cannot receive emails.')
        return
      }

      setEmailError('')
    } catch {
      // silently fail — server will catch on submit
    } finally {
      setEmailChecking(false)
    }
  }

  const checkPasswordMatch = (value) => {
    setConfirmPassword(value)
    if (password && value && value !== password) {
      setPasswordError('Passwords do not match.')
    } else {
      setPasswordError('')
    }
  }

const submitHandler = async () => {
  if (!name || !email || !password || !confirmPassword) {
    setError('Please fill in all fields.')
    return
  }
  if (password !== confirmPassword) {
    setPasswordError('Passwords do not match.')
    return
  }
  if (emailError || passwordError) return

  try {
    setLoading(true)
    setError('')
    const { data } = await axios.post(`${API_URL}/api/users/register`, { name, email, password })
    navigate('/verify-otp', { state: { userId: data.userId } }) 
  } catch (err) {
    setError(err.response?.data?.message || 'Registration failed.')
  } finally {
    setLoading(false)
  }
}

  const isBlocked = loading || !!emailError || !!passwordError || emailChecking

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

        {/* Email */}
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
        {emailChecking && <p className='text-gray-400 text-sm mb-3'>Checking email...</p>}
        {emailError && <p className='text-red-500 text-sm mb-3'>{emailError}</p>}
        {!emailChecking && !emailError && email && (
          <p className='text-green-500 text-sm mb-3'>Email looks good.</p>
        )}

        {/* Password */}
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (confirmPassword && e.target.value !== confirmPassword) {
              setPasswordError('Passwords do not match.')
            } else {
              setPasswordError('')
            }
          }}
          className='w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />

        {/* Confirm Password */}
        <input
          type='password'
          placeholder='Confirm Password'
          value={confirmPassword}
          onChange={(e) => checkPasswordMatch(e.target.value)}
          className={`w-full border rounded px-4 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            passwordError ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {passwordError && <p className='text-red-500 text-sm mb-3'>{passwordError}</p>}
        {!passwordError && confirmPassword && password === confirmPassword && (
          <p className='text-green-500 text-sm mb-3'>Passwords match.</p>
        )}

        <button
          onClick={submitHandler}
          disabled={isBlocked}
          className='w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold mt-3 disabled:opacity-50'
        >
          {loading ? 'Registering...' : emailChecking ? 'Validating...' : 'Register'}
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