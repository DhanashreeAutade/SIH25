import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

const defaultCenter = [28.6139, 77.2090];

const createIcon = (isActiveSOS) =>
  L.divIcon({
    className: 'tourist-marker',
    html: `<div class="marker-dot ${isActiveSOS ? 'marker-sos' : ''}"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

const HeatLayer = ({ points }) => {
  const map = useMap();
  const heatRef = useRef(null);

  useEffect(() => {
    if (!map) return;
    if (heatRef.current) {
      heatRef.current.setLatLngs(points);
      return;
    }
    const heat = L.heatLayer(points, { radius: 25, blur: 18, maxZoom: 16, minOpacity: 0.35, max: 1.0 });
    heat.addTo(map);
    heatRef.current = heat;
    return () => {
      if (heatRef.current) {
        heatRef.current.remove();
        heatRef.current = null;
      }
    };
  }, [map, points]);

  return null;
};

export default function MapView({ tourists, restrictedPoints, selectedId, onMarkerClick }) {
  const center = useMemo(() => {
    const sel = tourists.find(t => t.id === selectedId);
    if (sel && sel.location && typeof sel.location.lat === 'number' && typeof sel.location.lng === 'number') {
      return [sel.location.lat, sel.location.lng]
    }
    const first = tourists.find(t => t.location && typeof t.location.lat === 'number' && typeof t.location.lng === 'number')
    return first ? [first.location.lat, first.location.lng] : defaultCenter;
  }, [tourists, selectedId]);

  return (
    <div className="map-container">
      <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <HeatLayer points={restrictedPoints} />

        {tourists.map(t => (
          <Marker
            key={t.id}
            position={[t.location.lat, t.location.lng]}
            icon={createIcon(t.sos.active)}
            eventHandlers={{ click: () => onMarkerClick?.(t.id) }}
          >
            <Popup>
              <div>
                <div><strong>{t.name}</strong> ({t.id})</div>
                <div>Lat: {t.location.lat.toFixed(4)}, Lng: {t.location.lng.toFixed(4)}</div>
                <div>SOS: {t.sos.active ? `${t.sos.severity} - ${t.sos.reason}` : 'No active SOS'}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}


