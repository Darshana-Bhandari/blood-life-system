import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/admin/users').then(r => setUsers(r.data.users)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openEdit = (user) => { setEditModal(user); setEditData({ name: user.name, email: user.email, role: user.role, is_verified: user.is_verified }); };

  const saveEdit = async () => {
    setSaving(true);
    try {
      await api.put(`/admin/users/${editModal.id}`, editData);
      setEditModal(null); load();
    } catch (err) { setError(err.response?.data?.message || 'Failed to update.'); }
    finally { setSaving(false); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user? This action is irreversible.')) return;
    try { await api.delete(`/admin/users/${id}`); load(); }
    catch (err) { alert(err.response?.data?.message || 'Failed to delete.'); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 className="section-title">👥 Manage Users</h1>
          <p className="section-subtitle">View and manage all registered users</p>
        </div>

        <div className="card">
          <div className="card-header">
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="form-control" placeholder="🔍 Search by name, email, or role..."
              style={{ maxWidth: 320 }} />
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{filtered.length} users</span>
          </div>
          <div className="table-wrapper">
            {loading ? (
              <div className="loading-screen" style={{ minHeight: 200 }}><div className="spinner" style={{ color: '#c53030' }} /></div>
            ) : (
              <table>
                <thead><tr>
                  <th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Verified</th><th>Joined</th><th>Actions</th>
                </tr></thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7}><div className="empty-state"><div className="empty-icon">👥</div><p>No users found</p></div></td></tr>
                  ) : filtered.map(u => (
                    <tr key={u.id}>
                      <td style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{u.id}</td>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td style={{ color: '#4b5563' }}>{u.email}</td>
                      <td><span className={`badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'donor' ? 'badge-warning' : 'badge-info'}`}>{u.role}</span></td>
                      <td><span className={`badge ${u.is_verified ? 'badge-success' : 'badge-secondary'}`}>{u.is_verified ? '✓ Yes' : '✗ No'}</span></td>
                      <td style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-sm btn-secondary" onClick={() => openEdit(u)}>Edit</button>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteUser(u.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {editModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setEditModal(null)}>
          <div className="modal">
            <h3 className="modal-title">✏️ Edit User: {editModal.name}</h3>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-group"><label className="form-label">Name</label>
              <input className="form-control" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Email</label>
              <input className="form-control" value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Role</label>
              <select className="form-control" value={editData.role} onChange={e => setEditData({ ...editData, role: e.target.value })}>
                <option value="admin">Admin</option><option value="donor">Donor</option><option value="receiver">Receiver</option>
              </select></div>
            <div className="form-group"><label className="form-label">Verified</label>
              <select className="form-control" value={editData.is_verified ? '1' : '0'} onChange={e => setEditData({ ...editData, is_verified: e.target.value === '1' })}>
                <option value="1">Yes</option><option value="0">No</option>
              </select></div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setEditModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveEdit} disabled={saving}>
                {saving ? <><span className="spinner" /> Saving...</> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
