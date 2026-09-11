import { useState, useEffect } from 'react'
import CarCard from '../components/CarCard'
import { getCars } from '../services/api'
import './Styling/Carpage.css'

const CARS_PER_PAGE = 12 

const CarsPage = () => {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchCars()
  }, [])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, priceRange])

  const fetchCars = async () => {
    try {
      const data = await getCars()
      setCars(data)
    } catch (error) {
      console.error('Error fetching cars:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          car.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrice = (!priceRange.min || car.price >= parseFloat(priceRange.min)) &&
                        (!priceRange.max || car.price <= parseFloat(priceRange.max))
    return matchesSearch && matchesPrice
  })

  /*PAGINATION LOGIC */
  const totalPages = Math.ceil(filteredCars.length / CARS_PER_PAGE)
  const startIndex = (currentPage - 1) * CARS_PER_PAGE
  const endIndex = startIndex + CARS_PER_PAGE
  const currentCars = filteredCars.slice(startIndex, endIndex)

  const goToPage = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) return <div className="loading">Loading cars...</div>

  return (
    <div className="cars-page">
      <h1 className="cars-title">All Cars for Sale</h1>
      
      {/* Filters */}
      <div className="cars-filters">
        <input
          type="text"
          placeholder="Search by title or description..."
          className="filter-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Price ($)"
          className="filter-input"
          value={priceRange.min}
          onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
        />
        <input
          type="number"
          placeholder="Max Price ($)"
          className="filter-input"
          value={priceRange.max}
          onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
        />
      </div>

      {/* Results Info */}
      {filteredCars.length > 0 && (
        <div className="cars-results-info">
          Showing <strong>{startIndex + 1}–{Math.min(endIndex, filteredCars.length)}</strong> of{' '}
          <strong>{filteredCars.length}</strong> cars
        </div>
      )}

      {/* Cars Grid */}
      {filteredCars.length === 0 ? (
        <div className="cars-empty">
          <p>No cars found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="cars-grid">
            {currentCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>

              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`page-number ${currentPage === page ? 'active' : ''}`}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                className="page-btn"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CarsPage