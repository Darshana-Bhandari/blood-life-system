import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function ReceiverRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/receiver/requests').then(r => setRequests(r.data.requests)).finally(() => setLoading(false));
  }, []);

  const statusBadge = (s) => {
    const map = { pending: 'badge-warning', approved: 'badge-info', completed: 'badge-success', rejected: 'badge-danger' };
    return <span className={`badge ${map[s] || 'badge-secondary'}`}>{s}</span>;
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 className="section-title">📋 My Blood Requests</h1>
          <p className="section-subtitle">Track the status of all your blood requests</p>
        </div>

        {loading ? (
          <div className="loading-screen"><div className="spinner" style={{ color: '#c53030' }} /></div>
        ) : requests.length === 0 ? (
          <div className="card"><div className="card-body"><div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No requests yet. <Link to="/receiver/search" style={{ color: '#c53030' }}>Search for a donor</Link> to get started.</p>
          </div></div></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {requests.map(r => (
              <div key={r.id} className="card">
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #c53030, #742a2a)', color: 'white', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{r.blood_type}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem' }}>Request #{r.id}</div>
                        <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Donor: <strong>{r.donor_name}</strong></div>
                        {r.donor_location && <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>📍 {r.donor_location}</div>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {statusBadge(r.status)}
                      <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.33rem' }}>{new Date(r.requested_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: '#4b5563', flexWrap: 'wrap' }}>
                    <span>🩸 Blood Type: <strong>{r.blood_type}</strong></span>
                    <span>💡 Units: <strong>{r.units}</strong></span>
                    {r.donor_phone && <span>📞 {r.donor_phone}</span>}
                  </div>
                  {r.message && (
                    <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#f9fafb', borderRadius: '8px', fontSize: '0.85rem', color: '#4b5563', fontStyle: 'italic' }}>
                      "{r.message}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
