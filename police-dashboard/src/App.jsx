import { useMemo, useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import './App.css'
import MapView from './components/MapView'
import Sidebar from './components/Sidebar'
import SOSModal from './components/SOSModal'
import { io } from 'socket.io-client'
import { restrictedPoints } from './data/dummyData'
import { useTourists } from './hooks/useTourists'
import Login from './pages/Login'

function Dashboard() {
  const { tourists, setTourists } = useTourists([])
  const [selectedId, setSelectedId] = useState(undefined)
  const [sosOpen, setSosOpen] = useState(false)
  const [sosUser, setSosUser] = useState(null)
  const [sosMessage, setSosMessage] = useState('Please move away from the restricted area. This is an official advisory.')
  const socketRef = useMemo(() => io('http://localhost:3000', { autoConnect: true }), [])

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('police_auth') || '{}')
    if (auth?.username) {
      socketRef.emit('join_authorities')
    }
    socketRef.on('tourist_location_update', (payload) => {
      setTourists((prev) => prev.map(t => t.id === payload.touristId ? { ...t, location: { lat: payload.location.latitude, lng: payload.location.longitude } } : t))
    })
    socketRef.on('geofence_alert', (alert) => {
      // Optionally, display a notification or mark the user
      // For demo, we can log or set SOS
      setTourists((prev) => prev.map(t => t.id === alert.touristId ? { ...t, sos: { active: true, reason: alert.reason || 'Restricted zone', severity: 'HIGH', time: new Date().toISOString() } } : t))
    })
    return () => {
      socketRef.off('tourist_location_update')
      socketRef.off('geofence_alert')
      socketRef.disconnect()
    }
  }, [socketRef])

  const handleQuickSOS = (user) => {
    setSosUser(user)
    setSosOpen(true)
  }

  const handleSendSOS = () => {
    if (sosUser) {
      socketRef.emit('emergency_alert', { type: 'POLICE_SOS', userId: sosUser.id, userName: sosUser.name, message: sosMessage, timestamp: new Date().toISOString() })
      alert('SOS sent successfully')
      setSosOpen(false)
    }
  }

  return (
    <div className="app-layout">
      <div className="app-header">
        <div style={{ fontWeight: 700 }}>Police Panel — Live Map & SOS</div>
        <div style={{ color: '#64748b' }}>Dummy data demo</div>
      </div>
      <MapView tourists={tourists} restrictedPoints={restrictedPoints} selectedId={selectedId} onMarkerClick={setSelectedId} />
      <Sidebar tourists={tourists} selectedId={selectedId} onSelect={setSelectedId} onQuickSOS={handleQuickSOS} />
      <SOSModal open={sosOpen} user={sosUser} message={sosMessage} onChangeMessage={setSosMessage} onClose={() => setSosOpen(false)} onSend={handleSendSOS} />
    </div>
  )
}

function PrivateRoute({ children }) {
  const isAuthed = !!localStorage.getItem('police_auth')
  return isAuthed ? children : <Navigate to="/login" replace />
}

export default function App() {
  const navigate = useNavigate()
  useEffect(() => {
    if (!localStorage.getItem('police_auth')) {
      navigate('/login', { replace: true })
    }
  }, [navigate])
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
