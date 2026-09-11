import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem('adminToken')
  
  return isAdminLoggedIn ? children : <Navigate to="/admin/login" />
}

export default PrivateRoute