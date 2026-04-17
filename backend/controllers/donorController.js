const { pool } = require('../config/db');

// @desc    Get donor profile
// @route   GET /api/donor/profile
const getDonorProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.*, u.name, u.email, u.created_at
      FROM donors d
      JOIN users u ON d.user_id = u.id
      WHERE d.user_id = ?
    `, [req.user.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Donor profile not found.' });
    res.json({ success: true, donor: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Update donor profile
// @route   PUT /api/donor/profile
const updateDonorProfile = async (req, res) => {
  const { blood_type, location, phone, availability } = req.body;
  try {
    await pool.query(`
      UPDATE donors SET blood_type = COALESCE(?, blood_type), location = COALESCE(?, location),
        phone = COALESCE(?, phone), availability = COALESCE(?, availability)
      WHERE user_id = ?
    `, [blood_type, location, phone, availability, req.user.id]);
    res.json({ success: true, message: 'Profile updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Get donor's donations
// @route   GET /api/donor/donations
const getMyDonations = async (req, res) => {
  try {
    const [donations] = await pool.query(`
      SELECT dr.*, u.name AS receiver_name
      FROM donation_requests dr
      JOIN donors d ON dr.donor_id = d.id
      LEFT JOIN receivers r ON dr.receiver_id = r.id
      LEFT JOIN users u ON r.user_id = u.id
      WHERE d.user_id = ?
      ORDER BY dr.requested_at DESC
    `, [req.user.id]);
    res.json({ success: true, donations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Create a donation entry
// @route   POST /api/donor/donations
const createDonation = async (req, res) => {
  const { blood_type, units, message } = req.body;
  try {
    const [donors] = await pool.query('SELECT id FROM donors WHERE user_id = ?', [req.user.id]);
    if (!donors.length) return res.status(404).json({ success: false, message: 'Donor profile not found.' });

    await pool.query(
      'INSERT INTO donation_requests (donor_id, blood_type, units, status, message) VALUES (?, ?, ?, "pending", ?)',
      [donors[0].id, blood_type, units, message]
    );

    await pool.query('UPDATE donors SET last_donated = CURDATE() WHERE user_id = ?', [req.user.id]);

    res.status(201).json({ success: true, message: 'Donation registered successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Get blood stock (for donors to view)
// @route   GET /api/donor/blood-stock
const getBloodStock = async (req, res) => {
  try {
    const [stock] = await pool.query('SELECT * FROM blood_stock ORDER BY blood_type');
    res.json({ success: true, stock });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getDonorProfile, updateDonorProfile, getMyDonations, createDonation, getBloodStock };
