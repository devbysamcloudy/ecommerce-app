import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../config'

function SuperAdminPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null

  useEffect(() => {
    if (!userInfo || !userInfo.isSuperAdmin) {
      navigate('/')
      return
    }
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/superadmin/users`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      )
      setUsers(data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const createAdminHandler = async () => {
    try {
      const { data } = await axios.post(
        `${API_URL}/api/superadmin/create-admin`,
        { name, email, password },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      )
      setMessage(data.message)
      setName(''); setEmail(''); setPassword('')
      fetchUsers()
    } catch (error) {
      setError('Failed to create admin. Email may already exist.')
    }
  }

  const promoteHandler = async (id) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/api/superadmin/promote/${id}`,
        {},
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      )
      setMessage(data.message)
      fetchUsers()
    } catch (error) {
      setMessage('Action failed')
    }
  }

  const demoteHandler = async (id) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/api/superadmin/demote/${id}`,
        {},
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      )
      setMessage(data.message)
      fetchUsers()
    } catch (error) {
      setMessage('Action failed')
    }
  }

  return (
    <div className='bg-gray-100 min-h-screen p-8'>
      <h2 className='text-3xl font-bold mb-8 text-gray-800'>Super Admin Dashboard</h2>
      <div className='bg-white rounded-lg shadow-md p-6 mb-8 max-w-lg'>
        <h3 className='text-xl font-bold mb-4 text-gray-800'>Create New Admin</h3>
        {message && <p className='text-green-500 mb-4 font-semibold'>{message}</p>}
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        <input
          type='text'
          placeholder='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='w-full border border-gray-300 rounded px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full border border-gray-300 rounded px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <button
          onClick={createAdminHandler}
          className='w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold'
        >
          Create Admin
        </button>
      </div>
      {loading ? (
        <p className='text-center text-gray-500'>Loading users...</p>
      ) : (
        <div className='bg-white rounded-lg shadow-md overflow-hidden'>
          <table className='w-full'>
            <thead className='bg-gray-900 text-white'>
              <tr>
                <th className='p-4 text-left'>Name</th>
                <th className='p-4 text-left'>Email</th>
                <th className='p-4 text-left'>Role</th>
                <th className='p-4 text-left'>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className='border-b border-gray-200 hover:bg-gray-50'>
                  <td className='p-4'>{user.name}</td>
                  <td className='p-4'>{user.email}</td>
                  <td className='p-4'>
                    <span className={`px-2 py-1 rounded text-sm font-semibold ${
                      user.isSuperAdmin ? 'bg-purple-100 text-purple-700' :
                      user.isAdmin ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className='p-4'>
                    {!user.isSuperAdmin && (
                      user.isAdmin ? (
                        <button
                          onClick={() => demoteHandler(user._id)}
                          className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm'
                        >
                          Demote
                        </button>
                      ) : (
                        <button
                          onClick={() => promoteHandler(user._id)}
                          className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm'
                        >
                          Promote
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default SuperAdminPage