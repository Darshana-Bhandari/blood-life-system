import { useState, useEffect } from 'react';
import api from '../../api/axios';

const STATUS_OPTIONS = ['pending', 'approved', 'rejected', 'completed'];

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/admin/donations').then(r => setDonations(r.data.donations)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const changeStatus = async (id, status) => {
    try { await api.put(`/admin/donations/${id}`, { status }); load(); }
    catch (err) { alert(err.response?.data?.message || 'Update failed.'); }
  };

  const filtered = filter ? donations.filter(d => d.status === filter) : donations;

  const statusBadge = (s) => {
    const map = { pending: 'badge-warning', approved: 'badge-info', completed: 'badge-success', rejected: 'badge-danger' };
    return <span className={`badge ${map[s] || 'badge-secondary'}`}>{s}</span>;
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 className="section-title">📋 Donation Requests</h1>
          <p className="section-subtitle">Manage all blood donation requests</p>
        </div>

        <div className="card">
          <div className="card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
            <select className="form-control" style={{ maxWidth: 200 }} value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{filtered.length} requests</span>
          </div>
          <div className="table-wrapper">
            {loading ? (
              <div className="loading-screen" style={{ minHeight: 200 }}><div className="spinner" style={{ color: '#c53030' }} /></div>
            ) : (
              <table>
                <thead><tr>
                  <th>ID</th><th>Blood</th><th>Donor</th><th>Receiver</th><th>Units</th><th>Status</th><th>Date</th><th>Action</th>
                </tr></thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={8}><div className="empty-state"><div className="empty-icon">📋</div><p>No requests found</p></div></td></tr>
                  ) : filtered.map(d => (
                    <tr key={d.id}>
                      <td style={{ color: '#9ca3af' }}>#{d.id}</td>
                      <td><span className="badge badge-danger">{d.blood_type}</span></td>
                      <td style={{ fontWeight: 500 }}>{d.donor_name || '—'}</td>
                      <td>{d.receiver_name || '—'}</td>
                      <td>{d.units}</td>
                      <td>{statusBadge(d.status)}</td>
                      <td style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{new Date(d.requested_at).toLocaleDateString()}</td>
                      <td>
                        <select className="form-control" style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem', width: 130 }}
                          value={d.status} onChange={e => changeStatus(d.id, e.target.value)}>
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
