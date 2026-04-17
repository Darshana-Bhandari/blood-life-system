import { useState, useEffect } from 'react';
import api from '../../api/axios';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function SearchDonors() {
  const [filters, setFilters] = useState({ blood_type: '', location: '' });
  const [donors, setDonors] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestModal, setRequestModal] = useState(null);
  const [reqForm, setReqForm] = useState({ units: 1, message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    // Load all donors initially when visiting the page
    const loadInitialDonors = async () => {
      setLoading(true);
      try {
        const res = await api.get('/receiver/search');
        setDonors(res.data.donors);
        setSearched(true);
      } catch (err) {
        console.error('Failed to quick-load donors on mount');
      } finally { setLoading(false); }
    };
    loadInitialDonors();
  }, []);

  const search = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg({ type: '', text: '' });
    try {
      const params = {};
      if (filters.blood_type) params.blood_type = filters.blood_type;
      if (filters.location) params.location = filters.location;
      const res = await api.get('/receiver/search', { params });
      setDonors(res.data.donors);
      setSearched(true);
    } catch (err) {
      setMsg({ type: 'error', text: 'Search failed. Please try again.' });
    } finally { setLoading(false); }
  };

  const submitRequest = async () => {
    setSubmitting(true); setMsg({ type: '', text: '' });
    try {
      await api.post('/receiver/requests', {
        donor_id: requestModal.id,
        blood_type: requestModal.blood_type,
        units: reqForm.units,
        message: reqForm.message,
      });
      setMsg({ type: 'success', text: `Request sent to ${requestModal.name}!` });
      setRequestModal(null); setReqForm({ units: 1, message: '' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Request failed.' });
    } finally { setSubmitting(false); }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 className="section-title">🔍 Find Donors</h1>
          <p className="section-subtitle">Search for available blood donors by type and location</p>
        </div>

        {msg.text && <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`}>{msg.text}</div>}

        {/* Search Form */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-body">
            <form onSubmit={search} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
                <label className="form-label">Blood Type</label>
                <select className="form-control" value={filters.blood_type} onChange={e => setFilters({ ...filters, blood_type: e.target.value })}>
                  <option value="">All Types</option>
                  {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
                <label className="form-label">Location</label>
                <input className="form-control" placeholder="City or area..." value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-end' }}>
                {loading ? <><span className="spinner" /> Searching...</> : '🔍 Search'}
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        {searched && (
          donors.length === 0 ? (
            <div className="card"><div className="card-body"><div className="empty-state"><div className="empty-icon">🔍</div><p>No donors found. Try different blood type or location.</p></div></div></div>
          ) : (
            <div className="grid-2">
              {donors.map(d => (
                <div key={d.id} className="donor-card">
                  <div className="donor-card-header">
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #c53030, #742a2a)', color: 'white', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{d.blood_type}</div>
                    <div>
                      <div className="donor-name">{d.name}</div>
                      <div className="donor-meta">Blood Type: <strong>{d.blood_type}</strong></div>
                    </div>
                    <span className={`badge ${d.availability ? 'badge-success' : 'badge-secondary'}`} style={{ marginLeft: 'auto' }}>
                      {d.availability ? '✓ Available' : '✗ Unavailable'}
                    </span>
                  </div>
                  <div className="donor-info">
                    {d.location && <div className="donor-info-item">📍 {d.location}</div>}
                    {d.last_donated && <div className="donor-info-item">📅 Last donated: {new Date(d.last_donated).toLocaleDateString()}</div>}
                  </div>
                  {d.availability && (
                    <button className="btn btn-primary btn-sm" onClick={() => setRequestModal(d)}>Request Blood →</button>
                  )}
                </div>
              ))}
            </div>
          )
        )}

        {!searched && (
          <div className="card"><div className="card-body"><div className="empty-state"><div className="empty-icon">🔍</div><p>Use the search above to find available donors.</p></div></div></div>
        )}
      </div>

      {requestModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setRequestModal(null)}>
          <div className="modal">
            <h3 className="modal-title">💉 Request Blood from {requestModal.name}</h3>
            <p style={{ color: '#6b7280', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              Blood Type: <strong style={{ color: '#c53030' }}>{requestModal.blood_type}</strong>
            </p>
            <div className="form-group">
              <label className="form-label">Units Needed</label>
              <input type="number" min={1} max={5} className="form-control" value={reqForm.units} onChange={e => setReqForm({ ...reqForm, units: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Message (optional)</label>
              <textarea className="form-control" placeholder="E.g. Emergency surgery needed..." value={reqForm.message} onChange={e => setReqForm({ ...reqForm, message: e.target.value })} rows={3} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setRequestModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={submitRequest} disabled={submitting}>
                {submitting ? <><span className="spinner" /> Sending...</> : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
