import axios from 'axios'

const API = axios.create({ baseURL: '/api' })

export const getItems = (params) => API.get('/items', { params })
export const getItem = (id) => API.get(`/items/${id}`)
export const createItem = (data) => API.post('/items', data)
export const updateItem = (id, data) => API.put(`/items/${id}`, data)
export const deleteItem = (id) => API.delete(`/items/${id}`)
export const getDashboard = () => API.get('/items/dashboard')

