import { useState, useEffect } from 'react';
import api from '../../api/axios';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function ReceiverProfile() {
  const [form, setForm] = useState({ blood_type: '', location: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    api.get('/receiver/profile').then(r => {
      const d = r.data.receiver;
      setForm({ blood_type: d.blood_type || '', location: d.location || '', phone: d.phone || '' });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg({ type: '', text: '' });
    try {
      await api.put('/receiver/profile', form);
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Update failed.' });
    } finally { setSaving(false); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" style={{ color: '#c53030' }} /></div>;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 600 }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 className="section-title">👤 My Profile</h1>
          <p className="section-subtitle">Set your blood type so donors can match you</p>
        </div>
        <div className="card">
          <div className="card-body">
            {msg.text && <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`}>{msg.text}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Required Blood Type</label>
                <select className="form-control" value={form.blood_type} onChange={e => setForm({ ...form, blood_type: e.target.value })}>
                  <option value="">Select Blood Type</option>
                  {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Location / City</label>
                <input className="form-control" placeholder="e.g. Kathmandu" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-control" placeholder="e.g. 9800000000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
                {saving ? <><span className="spinner" /> Saving...</> : '💾 Save Profile'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
