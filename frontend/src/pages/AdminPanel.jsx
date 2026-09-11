import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminStats, getMessages, getCars, addCar, deleteCar, 
  updateAboutContent, addTestimonial, deleteMessage,
  markMessageRead 
} from '../services/api'
import './Styling/Adminpanel.css'

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [messages, setMessages] = useState([])
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [carForm, setCarForm] = useState({
    title: '', price: '', description: '', contact: '', image_url: ''
  })
  const [aboutForm, setAboutForm] = useState({
    title: '', content: '', mission_statement: '', contact_email: '', contact_phone: ''
  })
  const [testimonialForm, setTestimonialForm] = useState({
    customer_name: '', content: '', rating: 5
  })
  
  const navigate = useNavigate()
  const token = localStorage.getItem('adminToken')

  useEffect(() => {
    if (!token) {
      navigate('/admin/login')
      return
    }
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'dashboard') {
        const statsData = await getAdminStats(token)
        setStats(statsData)
      } else if (activeTab === 'messages') {
        const messagesData = await getMessages(token)
        setMessages(messagesData)
      } else if (activeTab === 'manageCars') {
        const carsData = await getCars()
        setCars(carsData)
      } else if (activeTab === 'about') {
        const response = await fetch('http://localhost:5000/api/about')
        const data = await response.json()
        setAboutForm(data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCar = async (e) => {
    e.preventDefault()
    try {
      await addCar(carForm, token)
      alert('Car added successfully!')
      setCarForm({ title: '', price: '', description: '', contact: '', image_url: '' })
      fetchData()
    } catch (error) {
      alert('Error adding car: ' + error.message)
    }
  }

  const handleDeleteCar = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await deleteCar(carId, token)
        fetchData()
      } catch (error) {
        alert('Error deleting car: ' + error.message)
      }
    }
  }

  const handleUpdateAbout = async (e) => {
    e.preventDefault()
    try {
      await updateAboutContent(aboutForm, token)
      alert('About content updated successfully!')
    } catch (error) {
      alert('Error updating about content: ' + error.message)
    }
  }

  const handleAddTestimonial = async (e) => {
    e.preventDefault()
    try {
      await addTestimonial(testimonialForm, token)
      alert('Testimonial added successfully!')
      setTestimonialForm({ customer_name: '', content: '', rating: 5 })
    } catch (error) {
      alert('Error adding testimonial: ' + error.message)
    }
  }

  const handleMarkRead = async (msgId) => {
    try {
      await markMessageRead(msgId, token)
      fetchData()
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const handleDeleteMessage = async (msgId) => {
    if (window.confirm('Delete this message?')) {
      try {
        await deleteMessage(msgId, token)
        fetchData()
      } catch (error) {
        alert('Error deleting message: ' + error.message)
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminInfo')
    navigate('/admin/login')
  }

  if (loading && activeTab !== 'addCar') {
    return <div className="loading">Loading admin panel...</div>
  }

  return (
    <div className="admin-panel">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-inner">
          <div>
            <h1>Kelly Motors Admin</h1>
            <p>Dashboard</p>
          </div>
          <button onClick={handleLogout} className="admin-logout">
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="admin-tabs">
        <div className="admin-tabs-inner">
          {['dashboard', 'addCar', 'manageCars', 'messages', 'about', 'testimonials'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <div className="admin-content">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div>
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <h3>Total Cars</h3>
                <p>{stats.total_cars}</p>
              </div>
              <div className="admin-stat-card">
                <h3>Total Messages</h3>
                <p>{stats.total_messages}</p>
              </div>
              <div className="admin-stat-card">
                <h3>Unread Messages</h3>
                <p className="yellow">{stats.unread_messages}</p>
              </div>
              <div className="admin-stat-card">
                <h3>Pending Testimonials</h3>
                <p className="orange">{stats.pending_testimonials}</p>
              </div>
            </div>
            
            <div className="admin-recent-grid">
              <div className="admin-recent-card">
                <h2>Recent Messages</h2>
                {stats.recent_messages?.length === 0 ? (
                  <p className="empty">No messages yet</p>
                ) : (
                  stats.recent_messages?.map(msg => (
                    <div key={msg.id} className="admin-recent-item">
                      <p className="item-title">{msg.name} ({msg.email})</p>
                      <p className="item-body">{msg.message.substring(0, 100)}...</p>
                      <p className="item-time">{new Date(msg.created_at).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
              
              <div className="admin-recent-card">
                <h2>Recent Cars</h2>
                {stats.recent_cars?.length === 0 ? (
                  <p className="empty">No cars listed yet</p>
                ) : (
                  stats.recent_cars?.map(car => (
                    <div key={car.id} className="admin-recent-item">
                      <p className="item-title">{car.title}</p>
                      <p className="item-price">${car.price.toLocaleString()}</p>
                      <p className="item-time">{new Date(car.created_at).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add Car Tab */}
        {activeTab === 'addCar' && (
          <div className="admin-form-card">
            <h2>Add New Car</h2>
            <form onSubmit={handleAddCar}>
              <div className="admin-field">
                <label>Title *</label>
                <input
                  type="text"
                  required
                  value={carForm.title}
                  onChange={(e) => setCarForm({...carForm, title: e.target.value})}
                />
              </div>
              <div className="admin-field">
                <label>Price ($) *</label>
                <input
                  type="number"
                  required
                  value={carForm.price}
                  onChange={(e) => setCarForm({...carForm, price: e.target.value})}
                />
              </div>
              <div className="admin-field">
                <label>Description *</label>
                <textarea
                  required
                  rows="4"
                  value={carForm.description}
                  onChange={(e) => setCarForm({...carForm, description: e.target.value})}
                />
              </div>
              <div className="admin-field">
                <label>Contact Info *</label>
                <input
                  type="text"
                  required
                  placeholder="Phone or Email"
                  value={carForm.contact}
                  onChange={(e) => setCarForm({...carForm, contact: e.target.value})}
                />
              </div>
              <div className="admin-field">
                <label>Image URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/car-image.jpg"
                  value={carForm.image_url}
                  onChange={(e) => setCarForm({...carForm, image_url: e.target.value})}
                />
              </div>
              <button type="submit" className="admin-btn-primary">
                Add Car
              </button>
            </form>
          </div>
        )}

        {/* Manage Cars Tab */}
        {activeTab === 'manageCars' && (
          <div className="admin-form-card">
            <h2>Manage Cars</h2>
            <div className="admin-list">
              {cars.map(car => (
                <div key={car.id} className="admin-list-item">
                  <div>
                    <h3>{car.title}</h3>
                    <p className="price">${car.price.toLocaleString()}</p>
                    <p className="contact">{car.contact}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteCar(car.id)}
                    className="admin-btn-danger"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="admin-form-card">
            <h2>User Messages</h2>
            {messages.length === 0 ? (
              <p className="admin-empty">No messages yet</p>
            ) : (
              <div className="admin-messages">
                {messages.map(msg => (
                  <div key={msg.id} className={`admin-message ${!msg.is_read ? 'unread' : ''}`}>
                    <div className="admin-message-header">
                      <div>
                        <p className="msg-name">{msg.name}</p>
                        <p className="msg-email">{msg.email}</p>
                      </div>
                      <div className="admin-message-actions">
                        {!msg.is_read && (
                          <button onClick={() => handleMarkRead(msg.id)} className="btn-link blue">
                            Mark as read
                          </button>
                        )}
                        <button onClick={() => handleDeleteMessage(msg.id)} className="btn-link red">
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="msg-body">{msg.message}</p>
                    <p className="msg-time">{new Date(msg.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="admin-form-card">
            <h2>Edit About Page</h2>
            <form onSubmit={handleUpdateAbout}>
              <div className="admin-field">
                <label>Title</label>
                <input
                  type="text"
                  value={aboutForm.title}
                  onChange={(e) => setAboutForm({...aboutForm, title: e.target.value})}
                />
              </div>
              <div className="admin-field">
                <label>Content</label>
                <textarea
                  rows="6"
                  value={aboutForm.content}
                  onChange={(e) => setAboutForm({...aboutForm, content: e.target.value})}
                />
              </div>
              <div className="admin-field">
                <label>Mission Statement</label>
                <textarea
                  rows="4"
                  value={aboutForm.mission_statement}
                  onChange={(e) => setAboutForm({...aboutForm, mission_statement: e.target.value})}
                />
              </div>
              <div className="admin-field">
                <label>Contact Email</label>
                <input
                  type="email"
                  value={aboutForm.contact_email}
                  onChange={(e) => setAboutForm({...aboutForm, contact_email: e.target.value})}
                />
              </div>
              <div className="admin-field">
                <label>Contact Phone</label>
                <input
                  type="text"
                  value={aboutForm.contact_phone}
                  onChange={(e) => setAboutForm({...aboutForm, contact_phone: e.target.value})}
                />
              </div>
              <button type="submit" className="admin-btn-primary">
                Update About Page
              </button>
            </form>
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className="admin-form-card">
            <h2>Add Testimonial</h2>
            <form onSubmit={handleAddTestimonial}>
              <div className="admin-field">
                <label>Customer Name *</label>
                <input
                  type="text"
                  required
                  value={testimonialForm.customer_name}
                  onChange={(e) => setTestimonialForm({...testimonialForm, customer_name: e.target.value})}
                />
              </div>
              <div className="admin-field">
                <label>Testimonial *</label>
                <textarea
                  required
                  rows="3"
                  value={testimonialForm.content}
                  onChange={(e) => setTestimonialForm({...testimonialForm, content: e.target.value})}
                />
              </div>
              <div className="admin-field">
                <label>Rating (1-5)</label>
                <select
                  value={testimonialForm.rating}
                  onChange={(e) => setTestimonialForm({...testimonialForm, rating: parseInt(e.target.value)})}
                >
                  {[5,4,3,2,1].map(r => (
                    <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="admin-btn-primary">
                Add Testimonial
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel