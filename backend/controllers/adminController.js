const { pool } = require('../config/db');

// @desc    Get all users
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, is_verified, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
const getUserById = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, is_verified, created_at FROM users WHERE id = ?',
      [req.params.id]
    );
    if (!users.length) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user: users[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Update user role/status
// @route   PUT /api/admin/users/:id
const updateUser = async (req, res) => {
  const { name, email, role, is_verified } = req.body;
  try {
    await pool.query(
      'UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), role = COALESCE(?, role), is_verified = COALESCE(?, is_verified) WHERE id = ?',
      [name, email, role, is_verified, req.params.id]
    );
    res.json({ success: true, message: 'User updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    if (req.params.id == req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account.' });
    }
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) AS totalUsers FROM users');
    const [[{ totalDonors }]] = await pool.query('SELECT COUNT(*) AS totalDonors FROM users WHERE role = "donor"');
    const [[{ totalReceivers }]] = await pool.query('SELECT COUNT(*) AS totalReceivers FROM users WHERE role = "receiver"');
    const [[{ totalDonations }]] = await pool.query('SELECT COUNT(*) AS totalDonations FROM donation_requests');
    const [[{ pendingRequests }]] = await pool.query('SELECT COUNT(*) AS pendingRequests FROM donation_requests WHERE status = "pending"');
    const [[{ completedDonations }]] = await pool.query('SELECT COUNT(*) AS completedDonations FROM donation_requests WHERE status = "completed"');
    const [bloodStock] = await pool.query('SELECT blood_type, units FROM blood_stock ORDER BY blood_type');
    const [recentRequests] = await pool.query(`
      SELECT dr.id, dr.blood_type, dr.units, dr.status, dr.requested_at,
             u1.name AS donor_name, u2.name AS receiver_name
      FROM donation_requests dr
      LEFT JOIN donors d ON dr.donor_id = d.id
      LEFT JOIN users u1 ON d.user_id = u1.id
      LEFT JOIN receivers r ON dr.receiver_id = r.id
      LEFT JOIN users u2 ON r.user_id = u2.id
      ORDER BY dr.requested_at DESC LIMIT 10
    `);

    res.json({
      success: true,
      stats: { totalUsers, totalDonors, totalReceivers, totalDonations, pendingRequests, completedDonations },
      bloodStock,
      recentRequests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Get all donation requests
// @route   GET /api/admin/donations
const getAllDonations = async (req, res) => {
  try {
    const [donations] = await pool.query(`
      SELECT dr.*, u1.name AS donor_name, u2.name AS receiver_name
      FROM donation_requests dr
      LEFT JOIN donors d ON dr.donor_id = d.id
      LEFT JOIN users u1 ON d.user_id = u1.id
      LEFT JOIN receivers r ON dr.receiver_id = r.id
      LEFT JOIN users u2 ON r.user_id = u2.id
      ORDER BY dr.requested_at DESC
    `);
    res.json({ success: true, donations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Update donation request status
// @route   PUT /api/admin/donations/:id
const updateDonationStatus = async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query(
      'UPDATE donation_requests SET status = ?, responded_at = NOW() WHERE id = ?',
      [status, req.params.id]
    );
    res.json({ success: true, message: 'Donation status updated.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Get blood stock
// @route   GET /api/admin/blood-stock
const getBloodStock = async (req, res) => {
  try {
    const [stock] = await pool.query('SELECT * FROM blood_stock ORDER BY blood_type');
    res.json({ success: true, stock });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Update blood stock units
// @route   PUT /api/admin/blood-stock
const updateBloodStock = async (req, res) => {
  const { blood_type, units } = req.body;
  if (!blood_type || units === undefined) {
    return res.status(400).json({ success: false, message: 'blood_type and units are required.' });
  }
  try {
    await pool.query(
      'INSERT INTO blood_stock (blood_type, units) VALUES (?, ?) ON DUPLICATE KEY UPDATE units = ?, updated_at = NOW()',
      [blood_type, units, units]
    );
    res.json({ success: true, message: 'Blood stock updated.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = {
  getAllUsers, getUserById, updateUser, deleteUser,
  getDashboardStats, getAllDonations, updateDonationStatus,
  getBloodStock, updateBloodStock,
};
