import { Link } from 'react-router-dom'
import '../pages/Styling/CarCard.css'

const CarCard = ({ car }) => {
  return (
    <div className="car-card">
      <div className="car-card-image">
        <img 
          src={car.image_url || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop'} 
          alt={car.title}
        />
        <span className="car-card-badge">Featured</span>
      </div>
      <div className="car-card-body">
        <h3 className="car-card-title">{car.title}</h3>
        <p className="car-card-price">${car.price.toLocaleString()}</p>
        <p className="car-card-desc">
          {car.description.length > 80 
            ? car.description.substring(0, 80) + '...' 
            : car.description}
        </p>
        <div className="car-card-footer">
          <span className="car-card-contact">
            📞 {car.contact}
          </span>
          <Link to={`/cars/${car.id}`} className="car-card-link">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CarCard