import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar({ cartCount }) {
  const navigate = useNavigate()
  const { userInfo, logout } = useAuth()

  const logoutHandler = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className='bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg'>
      <Link to='/' className='text-xl font-bold text-white hover:text-gray-300'>
        🛒 ShopEasy
      </Link>
      <div className='flex gap-6 items-center'>
        <Link to='/cart' className='text-white hover:text-gray-300'>
          Cart ({cartCount})
        </Link>
        {userInfo?.isAdmin && (
          <Link to='/admin' className='text-white hover:text-gray-300'>Admin</Link>
        )}
        {userInfo?.isSuperAdmin && (
          <Link to='/superadmin' className='text-white hover:text-gray-300'>Super Admin</Link>
        )}
        {userInfo ? (
          <>
            <Link to='/orders' className='text-white hover:text-gray-300'>My Orders</Link>
            <Link to='/profile' className='text-white hover:text-gray-300'>My Profile</Link>
            <span className='text-gray-300'>Hello, {userInfo.name}</span>
            <button
              onClick={logoutHandler}
              className='bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white'
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to='/login' className='text-white hover:text-gray-300'>Login</Link>
            <Link to='/register' className='bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white'>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar