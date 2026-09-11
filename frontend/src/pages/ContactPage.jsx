import { useState } from 'react'
import { submitMessage } from '../services/api'
import './Styling/Contact.css'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await submitMessage(formData)
      setSuccess(true)
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>

      {success && (
        <div className="contact-alert contact-alert-success">
            Message sent successfully! We'll get back to you soon.
        </div>
      )}

      {error && (
        <div className="contact-alert contact-alert-error">
          ❌ {error}
        </div>
      )}

      <div className="contact-card">
        <form onSubmit={handleSubmit}>
          <div className="contact-field">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="contact-field">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="contact-field">
            <label>Message *</label>
            <textarea
              name="message"
              required
              rows="5"
              placeholder="Tell us how we can help..."
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="contact-submit"
          >
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ContactPage