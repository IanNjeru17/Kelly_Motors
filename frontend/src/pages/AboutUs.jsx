import { useState, useEffect } from 'react'
import { getAboutContent, getTestimonials } from '../services/api'
import './Styling/About.css'

const AboutUs = () => {
  const [about, setAbout] = useState(null)
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [aboutData, testimonialsData] = await Promise.all([
        getAboutContent(),
        getTestimonials()
      ])
      setAbout(aboutData)
      setTestimonials(testimonialsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="about-page">
      <div className="about-header">
        <h1>{about?.title || 'About Kelly Motors'}</h1>
        <p className="about-tagline">Your Trusted Partner in Quality Pre-Owned Vehicles</p>
      </div>

      <div className="about-card">
        <section className="about-section">
          <h2>Our Story</h2>
          <p>{about?.content}</p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>{about?.mission_statement}</p>
        </section>

        <section className="about-section">
          <h2>Contact Information</h2>
          <div className="about-contact">
            <span>📧 {about?.contact_email}</span>
            <span>📞 {about?.contact_phone}</span>
          </div>
        </section>
      </div>

      {testimonials.length > 0 && (
        <div className="testimonials-card">
          <h2>Customer Testimonials</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial">
                <div className="testimonial-stars">
                  {'★'.repeat(testimonial.rating)}
                  <span className="stars-empty">{'☆'.repeat(5 - testimonial.rating)}</span>
                </div>
                <p className="testimonial-text">"{testimonial.content}"</p>
                <p className="testimonial-author">— {testimonial.customer_name}</p>
                <p className="testimonial-date">
                  {new Date(testimonial.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AboutUs