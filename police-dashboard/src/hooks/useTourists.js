import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { getTouristStatus, getRecentTouristIds, setAuthToken } from '../services/api'

export function useTourists(initialIds = []) {
  const [tourists, setTourists] = useState([])
  const socketRef = useRef(null)
  const idsRef = useRef(initialIds)

  const connectSocket = useCallback(() => {
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:3000', { autoConnect: true })
      socketRef.current.emit('join_authorities')

      socketRef.current.on('new_emergency', (data) => {
        setTourists((prev) => prev.map(t => t.id === data.userId ? { ...t, sos: { active: true, reason: data.message || data.type, severity: 'HIGH', time: data.timestamp } } : t))
      })
    }
    return socketRef.current
  }, [])

  const fetchStatuses = useCallback(async () => {
    if (!idsRef.current.length) return
    const results = await Promise.allSettled(idsRef.current.map(id => getTouristStatus(id)))
    const next = results.map((r, idx) => {
      const id = idsRef.current[idx]
      const existing = tourists.find(t => t.id === id)
      const fallback = existing || { id, name: `Tourist ${id}`, location: { lat: 0, lng: 0 }, sos: { active: false } }
      if (r.status !== 'fulfilled') return fallback
      const data = r.value?.tourist || r.value
      return {
        id: data.id || id,
        name: data.fullName || fallback.name,
        location: data.currentLocation ? { lat: data.currentLocation.latitude || 0, lng: data.currentLocation.longitude || 0 } : { lat: data.currentLatitude || data.latitude || 0, lng: data.currentLongitude || data.longitude || 0 },
        sos: fallback.sos,
      }
    })
    setTourists(next)
  }, [tourists])

  const bootstrapIds = useCallback(async () => {
    const token = localStorage.getItem('auth_token')
    if (token) setAuthToken(token)
    const discovered = await getRecentTouristIds(50)
    if (discovered.length) idsRef.current = discovered
  }, [])

  useEffect(() => {
    connectSocket()
    bootstrapIds().then(fetchStatuses)
    const iv = setInterval(fetchStatuses, 5000)
    return () => {
      clearInterval(iv)
      socketRef.current?.disconnect()
    }
  }, [connectSocket, fetchStatuses])

  return useMemo(() => ({ tourists, setTourists }), [tourists])
}


