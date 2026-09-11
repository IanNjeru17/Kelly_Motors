import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import CarsPage from './pages/CarsPage'
import CarDetailsPage from './pages/CarDetailsPage'
import AboutUs from './pages/AboutUs'
import ContactPage from './pages/ContactPage'
import AdminLogin from './pages/AdminLogin'
import AdminPanel from './pages/AdminPanel'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        // Public Routes 
        <Route path="/" element={<HomePage />} />
        <Route path="/cars" element={<CarsPage />} />
        <Route path="/cars/:id" element={<CarDetailsPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactPage />} />
        
        // Admin Routes - Hidden from navigation 

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <PrivateRoute>
            <AdminPanel />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App