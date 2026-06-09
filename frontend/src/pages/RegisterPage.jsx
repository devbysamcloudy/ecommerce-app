import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submitHandler = async () => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/register', {
        name,
        email,
        password
      })
      localStorage.setItem('userInfo', JSON.stringify(data))
      navigate('/')
    } catch (error) {
      setError('Registration failed. Email may already exist.')
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
          className='w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold'
        >
          Register
        </button>
        <p className='text-center mt-4 text-gray-600'>
          Already have an account? <Link to='/login' className='text-blue-500 hover:underline'>Login</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage