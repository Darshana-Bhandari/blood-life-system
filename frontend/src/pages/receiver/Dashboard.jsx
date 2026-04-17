import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function ReceiverDashboard() {
  const { user } = useAuth();
  const [stock, setStock] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/receiver/blood-stock').then(r => setStock(r.data.stock)).catch(() => { }),
      api.get('/receiver/requests').then(r => setRequests(r.data.requests)).catch(() => { }),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" style={{ color: '#c53030' }} /></div>;

  const statusBadge = (s) => {
    const map = { pending: 'badge-warning', approved: 'badge-info', completed: 'badge-success', rejected: 'badge-danger' };
    return <span className={`badge ${map[s] || 'badge-secondary'}`}>{s}</span>;
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="dash-header">
          <h1>Welcome, {user?.name} 💉</h1>
          <p>Find blood donors near you and request blood with ease.</p>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card"><div className="stat-icon1 blue"></div>
            <div><div className="stat-value">{requests.length}</div><div className="stat-label">My Requests</div></div></div>
          <div className="stat-card"><div className="stat-icon1 orange"></div>
            <div><div className="stat-value">{requests.filter(r => r.status === 'pending').length}</div><div className="stat-label">Pending</div></div></div>
          <div className="stat-card"><div className="stat-icon1 green"></div>
            <div><div className="stat-value">{requests.filter(r => r.status === 'completed').length}</div><div className="stat-label">Completed</div></div></div>
        </div>

        {/* Quick Actions */}
        <div className="grid-2" style={{ marginBottom: '2rem' }}>
          {[
            { to: '/receiver/search', title: 'Find Donors', desc: 'Search donors by blood type & location' },
            { to: '/receiver/requests', title: 'My Requests', desc: 'Track your blood requests' },
          ].map(l => (
            <Link key={l.to} to={l.to} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = ''}>
              <div style={{ fontSize: '2rem' }}>{l.icon}</div>
              <div><div style={{ fontWeight: 700 }}>{l.title}</div><div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{l.desc}</div></div>
            </Link>
          ))}
        </div>

        {/* Blood Stock */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header"><h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>🩸 Blood Availability</h2></div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.75rem' }}>
              {stock.map(s => (
                <div key={s.blood_type} style={{ textAlign: 'center', padding: '0.75rem', background: s.units === 0 ? '#fff5f5' : '#f0fff4', borderRadius: '10px', border: `1px solid ${s.units === 0 ? '#fed7d7' : '#c6f6d5'}` }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: s.units === 0 ? '#e53e3e' : '#38a169', color: 'white', fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem' }}>{s.blood_type}</div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: s.units === 0 ? '#c53030' : '#276749' }}>{s.units}</div>
                  <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>{s.units === 0 ? 'Out' : 'units'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Requests */}
        <div className="card">
          <div className="card-header">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>📋 Recent Blood Requests</h2>
            <Link to="/receiver/requests" className="btn btn-sm btn-secondary">View All</Link>
          </div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Blood Type</th><th>Donor</th><th>Units</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {requests.slice(0, 5).length === 0
                  ? <tr><td colSpan={5}><div className="empty-state"><p>No requests yet. <Link to="/receiver/search" style={{ color: '#c53030' }}>Find a donor!</Link></p></div></td></tr>
                  : requests.slice(0, 5).map(r => (
                    <tr key={r.id}>
                      <td><span className="badge badge-danger">{r.blood_type}</span></td>
                      <td>{r.donor_name}</td>
                      <td>{r.units}</td>
                      <td>{statusBadge(r.status)}</td>
                      <td style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{new Date(r.requested_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
