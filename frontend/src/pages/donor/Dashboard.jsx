import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function DonorDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stock, setStock] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/donor/profile').then(r => setProfile(r.data.donor)).catch(() => { }),
      api.get('/donor/blood-stock').then(r => setStock(r.data.stock)).catch(() => { }),
      api.get('/donor/donations').then(r => setDonations(r.data.donations)).catch(() => { }),
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
          <h1>Welcome, {user?.name} 🩸</h1>
          <p>Thank you for being a lifesaver! Here's your donor overview.</p>
        </div>

        {/* Profile Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, #c53030, #742a2a)', color: 'white' }}>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>🩸</div>
                <div>
                  <div style={{ opacity: 0.8, fontSize: '0.875rem' }}>Blood Type</div>
                  <div style={{ fontWeight: 800, fontSize: '2rem' }}>{profile?.blood_type || '—'}</div>
                </div>
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', fontSize: '0.8rem', opacity: 0.85 }}>
                <span>📍 {profile?.location || 'Location not set'}</span>
                <span>📞 {profile?.phone || 'Phone not set'}</span>
              </div>
            </div>
          </div>

          <div className="stat-card"><div className="stat-icon1 red"></div>
            <div><div className="stat-value">{donations.length}</div><div className="stat-label">Total Donations</div></div></div>

          <div className="stat-card"><div className="stat-icon1 green"></div>
            <div><div className="stat-value">{donations.filter(d => d.status === 'completed').length}</div><div className="stat-label">Completed</div></div></div>
        </div>

        {/* Quick Actions */}
        <div className="grid-2" style={{ marginBottom: '2rem' }}>
          {[
            { to: '/donor/profile', title: 'Update Profile', desc: 'Set your blood type & availability' },
            { to: '/donor/donations', title: 'My Donations', desc: 'View & register donations' },
          ].map(l => (
            <Link key={l.to} to={l.to} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', cursor: 'pointer' }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = ''}>
              <div style={{ fontSize: '2rem' }}>{l.icon}</div>
              <div><div style={{ fontWeight: 700 }}>{l.title}</div><div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{l.desc}</div></div>
            </Link>
          ))}
        </div>

        {/* Blood Stock */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header"><h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>🩸 Current Blood Stock</h2></div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.75rem' }}>
              {stock.map(s => (
                <div key={s.blood_type} style={{ textAlign: 'center', padding: '0.75rem', background: s.units === 0 ? '#fff5f5' : '#f0fff4', borderRadius: '10px', border: `1px solid ${s.units === 0 ? '#fed7d7' : '#c6f6d5'}` }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#c53030', color: 'white', fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem' }}>{s.blood_type}</div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{s.units}</div>
                  <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>units</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Donations */}
        <div className="card">
          <div className="card-header">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>📋 Recent Donations</h2>
            <Link to="/donor/donations" className="btn btn-sm btn-secondary">View All</Link>
          </div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Blood Type</th><th>Units</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {donations.slice(0, 5).length === 0
                  ? <tr><td colSpan={4}><div className="empty-state"><p>No donations yet. <Link to="/donor/donations" style={{ color: '#c53030' }}>Register one!</Link></p></div></td></tr>
                  : donations.slice(0, 5).map(d => (
                    <tr key={d.id}>
                      <td><span className="badge badge-danger">{d.blood_type}</span></td>
                      <td>{d.units}</td>
                      <td>{statusBadge(d.status)}</td>
                      <td style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{new Date(d.requested_at).toLocaleDateString()}</td>
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
