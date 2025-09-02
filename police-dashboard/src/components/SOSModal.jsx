export default function SOSModal({ open, user, message, onChangeMessage, onClose, onSend }) {
  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'grid', placeItems: 'center', zIndex: 10000 }}>
      <div style={{ width: 420, background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
        <div style={{ padding: 16, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 800 }}>Send SOS to {user?.name} ({user?.id})</div>
          <button onClick={onClose} style={{ border: 0, background: 'transparent', fontSize: 20, lineHeight: 1, cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ padding: 16 }}>
          <textarea
            value={message}
            onChange={(e) => onChangeMessage?.(e.target.value)}
            placeholder="Type a message to send..."
            rows={5}
            style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e5e7eb', resize: 'vertical' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
            <button onClick={onClose} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer' }}>Cancel</button>
            <button onClick={onSend} style={{ padding: '10px 12px', borderRadius: 8, border: 0, background: '#16a34a', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Send SOS</button>
          </div>
        </div>
      </div>
    </div>
  )
}


