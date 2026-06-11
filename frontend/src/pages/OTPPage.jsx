import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../config'
import { useAuth } from '../context/AuthContext'

function OTPPage() {
  const { state } = useLocation()
  const userId = state?.userId
  const navigate = useNavigate()
  const { login } = useAuth()

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const verifyHandler = async () => {
    if (!otp) { setError('Please enter the OTP.'); return }
    try {
      setLoading(true)
      setError('')
      const { data } = await axios.post(`${API_URL}/api/users/verify-otp`, { userId, otp })
      login(data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed.')
    } finally {
      setLoading(false)
    }
  }

  const resendHandler = async () => {
    try {
      setError('')
      setMessage('')
      const { data } = await axios.post(`${API_URL}/api/users/resend-otp`, { userId })
      setMessage(data.message)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not resend OTP.')
    }
  }

  if (!userId) {
    navigate('/register')
    return null
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-2 text-center'>Verify your email</h2>
        <p className='text-gray-500 text-center mb-6'>
          We sent a 6-digit code to your email. Enter it below.
        </p>

        {error && <p className='text-red-500 mb-4 text-center'>{error}</p>}
        {message && <p className='text-green-500 mb-4 text-center'>{message}</p>}

        <input
          type='text'
          placeholder='Enter 6-digit OTP'
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className='w-full border border-gray-300 rounded px-4 py-2 mb-4 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500'
        />

        <button
          onClick={verifyHandler}
          disabled={loading}
          className='w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold disabled:opacity-50'
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>

        <button
          onClick={resendHandler}
          className='w-full text-blue-500 hover:underline mt-4 text-sm text-center'
        >
          Resend OTP
        </button>
      </div>
    </div>
  )
}

export default OTPPage