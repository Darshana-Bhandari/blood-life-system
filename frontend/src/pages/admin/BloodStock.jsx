import { useState, useEffect } from 'react';
import api from '../../api/axios';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function AdminBloodStock() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState({});

  const load = () => {
    setLoading(true);
    api.get('/admin/blood-stock').then(r => {
      const map = {};
      r.data.stock.forEach(s => { map[s.blood_type] = s.units; });
      setStock(r.data.stock);
      setEditing(map);
    }).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const save = async (blood_type) => {
    try {
      await api.put('/admin/blood-stock', { blood_type, units: Number(editing[blood_type]) });
      load();
    } catch (err) { alert(err.response?.data?.message || 'Save failed.'); }
  };

  const getColor = (units) => {
    if (units === 0) return { bg: '#fff5f5', border: '#fed7d7', text: '#c53030' };
    if (units < 10) return { bg: '#fffaf0', border: '#fbd38d', text: '#c05621' };
    return { bg: '#f0fff4', border: '#c6f6d5', text: '#276749' };
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 className="section-title">🩸 Blood Stock Management</h1>
          <p className="section-subtitle">Update blood inventory levels for each blood type</p>
        </div>

        {loading ? (
          <div className="loading-screen"><div className="spinner" style={{ color: '#c53030' }} /></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {BLOOD_TYPES.map(bt => {
              const item = stock.find(s => s.blood_type === bt);
              const units = editing[bt] ?? item?.units ?? 0;
              const colors = getColor(Number(units));
              return (
                <div key={bt} className="card" style={{ border: `2px solid ${colors.border}`, background: colors.bg }}>
                  <div className="card-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: '50%',
                        background: `linear-gradient(135deg, #c53030, ${colors.text})`,
                        color: 'white', fontWeight: 800, fontSize: '0.9rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>{bt}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem' }}>Blood Type {bt}</div>
                        <div style={{ fontSize: '0.75rem', color: colors.text, fontWeight: 600 }}>
                          {Number(units) === 0 ? '⚠ Out of Stock' : Number(units) < 10 ? '⚡ Low Stock' : '✓ In Stock'}
                        </div>
                      </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label className="form-label">Units Available</label>
                      <input
                        type="number" min={0} className="form-control"
                        value={editing[bt] ?? ''}
                        onChange={e => setEditing({ ...editing, [bt]: e.target.value })}
                      />
                    </div>
                    <button className="btn btn-primary btn-full btn-sm" onClick={() => save(bt)}>Update</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
