import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginStakeholder, setAuthToken } from '../services/api'

const HARDCODED = { username: 'police.admin', password: 'Secure@123' }

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      // Treat username as email for backend login
      const res = await loginStakeholder(username, password)
      const token = res?.token
      if (!token) throw new Error('No token returned')
      localStorage.setItem('auth_token', token)
      localStorage.setItem('police_auth', JSON.stringify({ username: res?.stakeholder?.fullName || username, email: res?.stakeholder?.email }))
      setAuthToken(token)
      navigate('/')
    } catch (err) {
      // Fallback to demo creds only if backend login fails
      if (username === HARDCODED.username && password === HARDCODED.password) {
        localStorage.setItem('police_auth', JSON.stringify({ username }))
        localStorage.setItem('auth_token', 'demo-token')
        navigate('/')
        return
      }
      setError('Invalid credentials or server unreachable')
    }
  }

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100vh', background: 'linear-gradient(135deg,#0f172a,#1e293b)' }}>
      <div style={{ width: 360, background: '#ffffff', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
        <div style={{ padding: 20, borderBottom: '1px solid #f2f2f2' }}>
          <div style={{ fontWeight: 800, fontSize: 18 }}>Police Panel Login</div>
          <div style={{ color: '#64748b', marginTop: 6, fontSize: 13 }}>Secure access for authorized personnel</div>
        </div>
        <form onSubmit={onSubmit} style={{ padding: 20 }}>
          <label style={{ fontSize: 13, color: '#334155' }}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g., police.admin"
            style={{ width: '100%', padding: '10px 12px', marginTop: 6, borderRadius: 8, border: '1px solid #e5e7eb' }}
            autoFocus
          />

          <div style={{ height: 12 }} />

          <label style={{ fontSize: 13, color: '#334155' }}>Password</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb' }}
            />
            <button type="button" onClick={() => setShowPassword(v => !v)} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#f8fafc' }}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {error && <div style={{ color: '#dc2626', fontSize: 13, marginTop: 10 }}>{error}</div>}

          <button type="submit" style={{ width: '100%', marginTop: 16, background: '#1d4ed8', color: '#fff', border: 0, borderRadius: 8, padding: '10px 12px', fontWeight: 700, cursor: 'pointer' }}>
            Sign In
          </button>

          <div style={{ marginTop: 12, fontSize: 12, color: '#64748b' }}>Demo credentials — username: <b>{HARDCODED.username}</b>, password: <b>{HARDCODED.password}</b></div>
        </form>
      </div>
    </div>
  )
}


