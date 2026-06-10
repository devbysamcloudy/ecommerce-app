import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, adminOnly = false, superAdminOnly = false }) {
  const { userInfo } = useAuth()

  if (!userInfo) return <Navigate to='/login' replace />
  if (adminOnly && !userInfo.isAdmin) return <Navigate to='/' replace />
  if (superAdminOnly && !userInfo.isSuperAdmin) return <Navigate to='/' replace />

  return children
}

export default ProtectedRoute