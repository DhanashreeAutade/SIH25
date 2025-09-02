export const dummyTourists = [
  {
    id: 'T-001',
    name: 'Aarav Sharma',
    location: { lat: 28.6139, lng: 77.209 },
    sos: {
      active: true,
      reason: 'Lost in crowded area',
      time: new Date().toISOString(),
      severity: 'HIGH'
    }
  },
  {
    id: 'T-002',
    name: 'Meera Iyer',
    location: { lat: 28.6328, lng: 77.2197 },
    sos: {
      active: false,
      reason: '—',
      time: null,
      severity: null
    }
  },
  {
    id: 'T-003',
    name: 'Rahul Verma',
    location: { lat: 28.5562, lng: 77.1 },
    sos: {
      active: true,
      reason: 'Medical assistance needed',
      time: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      severity: 'CRITICAL'
    }
  },
  {
    id: 'T-004',
    name: 'Sara Khan',
    location: { lat: 28.7041, lng: 77.1025 },
    sos: {
      active: false,
      reason: '—',
      time: null,
      severity: null
    }
  }
];

// Restricted area points for heatmap-like overlay (lat, lng, intensity)
export const restrictedPoints = [
  [28.6129, 77.2295, 0.8], // near India Gate
  [28.6125, 77.235, 0.7],
  [28.61, 77.22, 0.6],
  [28.65, 77.18, 0.5],
  [28.64, 77.2, 0.6],
  [28.59, 77.21, 0.7]
];



