export default function Sidebar({ tourists, selectedId, onSelect, onQuickSOS }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">Tourists & SOS</div>
      <div className="list">
        {tourists.map(t => (
          <button
            key={t.id}
            className={`list-item ${selectedId === t.id ? 'selected' : ''} ${t.sos.active ? 'has-sos' : ''}`}
            onClick={() => {
              onSelect?.(t.id)
              onQuickSOS?.(t)
            }}
          >
            <div className="item-title">{t.name || t.id}</div>
            <div className="item-sub">
              {t.sos.active ? (
                <>
                  <span className={`badge badge-${(t.sos.severity || 'LOW').toLowerCase()}`}>{t.sos.severity}</span>
                  <span className="reason">{t.sos.reason}</span>
                </>
              ) : (
                <span className="no-sos">No active SOS</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}


