const API_URL = 'http://localhost:5000/api'

// Helper function to handle responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Request failed')
  }
  return response.json()
}

// PUBLIC ENDPOINTS 

export const getCars = async () => {
  const response = await fetch(`${API_URL}/cars`)
  return handleResponse(response)
}

export const getCarDetails = async (id) => {
  const response = await fetch(`${API_URL}/cars/${id}`)
  return handleResponse(response)
}

export const getAboutContent = async () => {
  const response = await fetch(`${API_URL}/about`)
  return handleResponse(response)
}

export const getTestimonials = async () => {
  const response = await fetch(`${API_URL}/testimonials`)
  return handleResponse(response)
}

export const submitMessage = async (messageData) => {
  const response = await fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messageData)
  })
  return handleResponse(response)
}

// ADMIN ENDPOINTS 

export const adminLogin = async (credentials) => {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
  return handleResponse(response)
}

export const getAdminStats = async (token) => {
  const response = await fetch(`${API_URL}/admin/stats`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  return handleResponse(response)
}

export const getMessages = async (token) => {
  const response = await fetch(`${API_URL}/admin/messages`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  return handleResponse(response)
}

export const markMessageRead = async (messageId, token) => {
  const response = await fetch(`${API_URL}/admin/messages/${messageId}/read`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  return handleResponse(response)
}

export const deleteMessage = async (messageId, token) => {
  const response = await fetch(`${API_URL}/admin/messages/${messageId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  return handleResponse(response)
}

export const addCar = async (carData, token) => {
  const response = await fetch(`${API_URL}/admin/cars`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(carData)
  })
  return handleResponse(response)
}

export const deleteCar = async (carId, token) => {
  const response = await fetch(`${API_URL}/admin/cars/${carId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  return handleResponse(response)
}

export const updateAboutContent = async (aboutData, token) => {
  const response = await fetch(`${API_URL}/admin/about`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(aboutData)
  })
  return handleResponse(response)
}

export const addTestimonial = async (testimonialData, token) => {
  const response = await fetch(`${API_URL}/admin/testimonials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(testimonialData)
  })
  return handleResponse(response)
}

export const approveTestimonial = async (testimonialId, token) => {
  const response = await fetch(`${API_URL}/admin/testimonials/${testimonialId}/approve`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  return handleResponse(response)
}

export const deleteTestimonial = async (testimonialId, token) => {
  const response = await fetch(`${API_URL}/admin/testimonials/${testimonialId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  return handleResponse(response)
}