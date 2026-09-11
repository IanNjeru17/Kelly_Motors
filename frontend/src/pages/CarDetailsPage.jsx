import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCarDetails } from '../services/api'
import './Styling/Cardetails.css'
const CarDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCarDetails()
  }, [id])

  const fetchCarDetails = async () => {
    try {
      const data = await getCarDetails(id)
      setCar(data)
    } catch (error) {
      console.error('Error fetching car details:', error)
      navigate('/cars')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading car details...</div>
  if (!car) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/cars')}
        className="mb-6 text-blue-600 hover:text-blue-800"
      >
        ← Back to Cars
      </button>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img 
              src={car.image_url || 'https://via.placeholder.com/600x400?text=No+Image'} 
              alt={car.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold mb-4">{car.title}</h1>
            <p className="text-3xl font-bold text-green-600 mb-4">
              ${car.price.toLocaleString()}
            </p>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{car.description}</p>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
              <p className="text-gray-700">{car.contact}</p>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">
                Listed on: {new Date(car.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetailsPage