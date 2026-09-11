import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCars, getTestimonials } from '../services/api'
import './Styling/Home.css'


const HomePage = () => {
  const [featuredCars, setFeaturedCars] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [carsData, testimonialsData] = await Promise.all([
        getCars(),
        getTestimonials()
      ])
      setFeaturedCars(carsData.slice(0, 6))
      setTestimonials(testimonialsData.slice(0, 3))
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading Kelly Motors...</div>

  return (
    <div className="homepage">
      {/*HERO SECTION*/}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-container">
          <div className="hero-content">
            
            <h1 className="hero-title">
              Find Your <span className="highlight">Dream Car</span> 
              <br />
              <span className="hero-subtitle">Drive Your Future Today</span>
            </h1>
            <p className="hero-description">
              Explore our curated collection of premium pre-owned vehicles. 
              Every car is thoroughly inspected and comes with a complete history report.
            </p>
            <div className="hero-buttons">
              <Link to="/cars" className="btn-primary hero-btn-primary">
                <span>Browse Collection</span>
                <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link to="/contact" className="btn-secondary hero-btn-secondary">
                Contact Us
              </Link>
            </div>
           
          </div>
        </div>
        <div className="hero-floating-cards">
          <div className="float-card float-card-1">
            <span className="float-icon">🚙</span>
            <div>
              <span className="float-title">Quality Cars</span>
              <span className="float-sub">Verified & Inspected</span>
            </div>
          </div>
          <div className="float-card float-card-2">
            <span className="float-icon">💰</span>
            <div>
              <span className="float-title">Best Prices</span>
              <span className="float-sub">No Hidden Fees</span>
            </div>
          </div>
          <div className="float-card float-card-3">
            <span className="float-icon">🤝</span>
            <div>
              <span className="float-title">Trusted</span>
              <span className="float-sub">Since 2022</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED VEHICLES ===== */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <div>              
              <h2 className="section-title">
                Featured <span className="highlight">Vehicles</span>
              </h2>
            </div>
            <Link to="/cars" className="view-all-link">
              View All <span className="view-all-arrow">→</span>
            </Link>
          </div>

          <div className="vehicles-grid">
            {featuredCars.map((car, index) => (
              <div key={car.id} className="vehicle-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="vehicle-image-wrapper">
                  <img 
                    src={car.image_url || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop'} 
                    alt={car.title}
                    className="vehicle-image"
                  />
                  <div className="vehicle-badge">
                    <span className="badge-text">Featured</span>
                  </div>
                  <div className="vehicle-overlay">
                    <Link to={`/cars/${car.id}`} className="vehicle-overlay-btn">
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="vehicle-info">
                  <div className="vehicle-header">
                    <h3 className="vehicle-title">{car.title}</h3>
                    <span className="vehicle-year">{car.year || '2024'}</span>
                  </div>
                  <p className="vehicle-description">{car.description.substring(0, 80)}...</p>
                  <div className="vehicle-footer">
                    <span className="vehicle-price">${car.price.toLocaleString()}</span>
                    <div className="vehicle-contact">
                      <span className="contact-icon">📞</span>
                      <span className="contact-text">{car.contact}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🔍</span>
              </div>
              <h3 className="feature-title">Quality Checked</h3>
              <p className="feature-description">Every vehicle undergoes a 150-point inspection by certified mechanics.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">📋</span>
              </div>
              <h3 className="feature-title">Full History</h3>
              <p className="feature-description">Complete vehicle history reports available for complete transparency.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🤝</span>
              </div>
              <h3 className="feature-title">Trusted Sellers</h3>
              <p className="feature-description">All sellers are verified to ensure safe and transparent transactions.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">💰</span>
              </div>
              <h3 className="feature-title">Best Value</h3>
              <p className="feature-description">Competitive pricing with no hidden fees or surprise costs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      {testimonials.length > 0 && (
        <section className="testimonials-section">
          <div className="container">
            <div className="section-header centered">
              <div>
                <span className="section-badge">✦ Testimonials</span>
                <h2 className="section-title">
                  What Our <span className="highlight">Customers</span> Say
                </h2>
              </div>
            </div>

            <div className="testimonials-grid">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-card">
                  <div className="testimonial-rating">
                    {'★'.repeat(testimonial.rating)}
                    <span className="empty-stars">{'☆'.repeat(5 - testimonial.rating)}</span>
                  </div>
                  <p className="testimonial-text">"{testimonial.content}"</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      {testimonial.customer_name.charAt(0)}
                    </div>
                    <div className="author-info">
                      <p className="author-name">{testimonial.customer_name}</p>
                      <p className="author-role">Verified Buyer</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <div className="cta-text">  
              <h2 className="cta-title">Start Your Journey Today</h2>
              <p className="cta-description">
                Find the perfect car that matches your style and budget. 
                Our team is here to help you every step of the way.
              </p>
            </div>
            
            <div className="cta-buttons">
              <Link to="/cars" className="btn-primary cta-btn-primary">
                Browse Cars
              </Link>
              <Link to="/contact" className="btn-secondary cta-btn-secondary">
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
         <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">98%</span>
                <span className="stat-label">Satisfaction Rate</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">4.8★</span>
                <span className="stat-label">Average Rating</span>
              </div>
            </div>
      </section>
    </div>
  )
}

export default HomePage