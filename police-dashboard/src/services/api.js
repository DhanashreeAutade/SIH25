import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
})

export function setAuthToken(token) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete api.defaults.headers.common['Authorization']
}

export async function loginStakeholder(email, password) {
  const res = await api.post('/stakeholders/login', { email, password })
  return res.data
}

export async function getScanHistory(page = 1, limit = 20) {
  const res = await api.get('/stakeholders/scan-history', { params: { page, limit } })
  return res.data
}

export async function getTouristStatus(touristId) {
  const res = await api.get(`/stakeholders/tourist-status/${touristId}`)
  return res.data
}

export async function getRecentTouristIds(limit = 50) {
  const data = await getScanHistory(1, limit)
  const ids = new Set()
  ;(data.history || []).forEach(item => {
    if (item.touristId) ids.add(item.touristId)
    if (item.tourist?.id) ids.add(item.tourist.id)
  })
  return Array.from(ids)
}

// Optional: fetch restricted zones if available; otherwise caller can supply static list
export async function getRestrictedZones() {
  // Implement when backend route is available
  return { zones: [] }
}


