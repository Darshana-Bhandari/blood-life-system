import { useState, useEffect } from 'react';
import api from '../../api/axios';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function DonorDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ blood_type: '', units: 1, message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const load = () => {
    api.get('/donor/donations').then(r => setDonations(r.data.donations)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setMsg({ type: '', text: '' });
    try {
      await api.post('/donor/donations', form);
      setMsg({ type: 'success', text: 'Donation registered! Waiting for admin approval.' });
      setShowForm(false); setForm({ blood_type: '', units: 1, message: '' });
      load();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to register donation.' });
    } finally { setSubmitting(false); }
  };

  const statusBadge = (s) => {
    const map = { pending: 'badge-warning', approved: 'badge-info', completed: 'badge-success', rejected: 'badge-danger' };
    return <span className={`badge ${map[s] || 'badge-secondary'}`}>{s}</span>;
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="section-title">🩸 My Donations</h1>
            <p className="section-subtitle">Track and register your blood donations</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Register Donation</button>
        </div>

        {msg.text && <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`}>{msg.text}</div>}

        {showForm && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
            <div className="modal">
              <h3 className="modal-title">🩸 Register New Donation</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Blood Type</label>
                  <select className="form-control" value={form.blood_type} onChange={e => setForm({ ...form, blood_type: e.target.value })} required>
                    <option value="">Select Blood Type</option>
                    {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Units</label>
                  <input type="number" min={1} max={5} className="form-control" value={form.units} onChange={e => setForm({ ...form, units: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Message (optional)</label>
                  <textarea className="form-control" placeholder="Any notes for the admin..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={3} />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? <><span className="spinner" /> Submitting...</> : 'Submit Donation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="card">
          <div className="table-wrapper">
            {loading ? (
              <div className="loading-screen" style={{ minHeight: 200 }}><div className="spinner" style={{ color: '#c53030' }} /></div>
            ) : (
              <table>
                <thead><tr><th>ID</th><th>Blood Type</th><th>Units</th><th>Status</th><th>Receiver</th><th>Date</th></tr></thead>
                <tbody>
                  {donations.length === 0
                    ? <tr><td colSpan={6}><div className="empty-state"><div className="empty-icon">🩸</div><p>No donations yet. Register one above!</p></div></td></tr>
                    : donations.map(d => (
                      <tr key={d.id}>
                        <td style={{ color: '#9ca3af' }}>#{d.id}</td>
                        <td><span className="badge badge-danger">{d.blood_type}</span></td>
                        <td>{d.units}</td>
                        <td>{statusBadge(d.status)}</td>
                        <td>{d.receiver_name || <span style={{ color: '#9ca3af' }}>—</span>}</td>
                        <td style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{new Date(d.requested_at).toLocaleDateString()}</td>
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
