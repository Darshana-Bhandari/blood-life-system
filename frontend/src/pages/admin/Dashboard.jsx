import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" style={{ color: '#c53030' }} /></div>;

  const BLOOD_COLORS = { 'A+': '#c53030', 'A-': '#e53e3e', 'B+': '#2b6cb0', 'B-': '#3182ce', 'AB+': '#6b46c1', 'AB-': '#805ad5', 'O+': '#276749', 'O-': '#38a169' };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="dash-header">
          <h1>Welcome back, {user?.name} 👋</h1>
          <p>Here's what's happening with BloodLife today</p>
        </div>

        {data && (
          <>
            <div className="stats-grid">
              {[
                { label: 'Total Users', value: data.stats.totalUsers },
                { label: 'Donors', value: data.stats.totalDonors, },
                { label: 'Receivers', value: data.stats.totalReceivers, },
                { label: 'Total Donations', value: data.stats.totalDonations, },
                { label: 'Pending', value: data.stats.pendingRequests, },
                { label: 'Completed', value: data.stats.completedDonations, },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div className={`stat-icon ${s.color}`}>{s.icon}</div>
                  <div>
                    <div className="stat-value">{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Blood Stock */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-header">
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>🩸 Blood Stock Levels</h2>
                <Link to="/admin/blood-stock" className="btn btn-sm btn-secondary">Manage</Link>
              </div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem' }}>
                  {data.bloodStock.map(b => (
                    <div key={b.blood_type} style={{ textAlign: 'center', padding: '1rem', borderRadius: '12px', background: '#fff5f5', border: '1px solid #fed7d7' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: BLOOD_COLORS[b.blood_type] || '#c53030', color: 'white', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>{b.blood_type}</div>
                      <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#111827' }}>{b.units}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>units</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Donations */}
            <div className="card">
              <div className="card-header">
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>📋 Recent Donation Requests</h2>
                <Link to="/admin/donations" className="btn btn-sm btn-secondary">View All</Link>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead><tr>
                    <th>Blood Type</th><th>Donor</th><th>Receiver</th><th>Units</th><th>Status</th><th>Date</th>
                  </tr></thead>
                  <tbody>
                    {data.recentRequests.length === 0 ? (
                      <tr><td colSpan={6}><div className="empty-state"><p>No donation requests yet</p></div></td></tr>
                    ) : data.recentRequests.map(r => (
                      <tr key={r.id}>
                        <td><span className="badge badge-danger">{r.blood_type}</span></td>
                        <td>{r.donor_name || '—'}</td>
                        <td>{r.receiver_name || '—'}</td>
                        <td>{r.units}</td>
                        <td><StatusBadge status={r.status} /></td>
                        <td style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{new Date(r.requested_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid-2" style={{ marginTop: '1.5rem' }}>
              {[
                { to: '/admin/users', title: 'Manage Users', desc: 'Add, edit, or remove users' },
                { to: '/admin/donations', title: 'Donations', desc: 'Approve or reject requests' },
              ].map(l => (
                <Link key={l.to} to={l.to} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'}
                  onMouseOut={e => e.currentTarget.style.boxShadow = ''}>
                  <div style={{ fontSize: '2rem' }}>{l.icon}</div>
                  <div><div style={{ fontWeight: 700 }}>{l.title}</div><div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{l.desc}</div></div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = { pending: 'badge-warning', approved: 'badge-info', completed: 'badge-success', rejected: 'badge-danger' };
  return <span className={`badge ${map[status] || 'badge-secondary'}`}>{status}</span>;
}
