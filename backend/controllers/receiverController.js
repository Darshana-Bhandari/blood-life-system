const { pool } = require('../config/db');

// @desc    Get receiver profile
// @route   GET /api/receiver/profile
const getReceiverProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, u.name, u.email, u.created_at
      FROM receivers r
      JOIN users u ON r.user_id = u.id
      WHERE r.user_id = ?
    `, [req.user.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Receiver profile not found.' });
    res.json({ success: true, receiver: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Update receiver profile
// @route   PUT /api/receiver/profile
const updateReceiverProfile = async (req, res) => {
  const { blood_type, location, phone } = req.body;
  try {
    await pool.query(`
      UPDATE receivers SET blood_type = COALESCE(?, blood_type), location = COALESCE(?, location),
        phone = COALESCE(?, phone)
      WHERE user_id = ?
    `, [blood_type, location, phone, req.user.id]);
    res.json({ success: true, message: 'Profile updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Search available donors by blood type and/or location
// @route   GET /api/receiver/search
const searchDonors = async (req, res) => {
  const { blood_type, location } = req.query;
  try {
    let query = `
      SELECT d.id, d.blood_type, d.location, d.availability, d.last_donated,
             u.name, u.email
      FROM donors d
      JOIN users u ON d.user_id = u.id
      WHERE d.availability = TRUE AND u.is_verified = TRUE AND d.blood_type IS NOT NULL
    `;
    const params = [];
    if (blood_type) {
      query += ' AND d.blood_type = ?';
      params.push(blood_type);
    }
    if (location) {
      query += ' AND d.location LIKE ?';
      params.push(`%${location}%`);
    }
    query += ' ORDER BY d.last_donated ASC, u.name ASC';

    const [donors] = await pool.query(query, params);
    res.json({ success: true, donors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Create blood request
// @route   POST /api/receiver/requests
const createRequest = async (req, res) => {
  const { donor_id, blood_type, units, message } = req.body;
  try {
    const [receivers] = await pool.query('SELECT id FROM receivers WHERE user_id = ?', [req.user.id]);
    if (!receivers.length) return res.status(404).json({ success: false, message: 'Receiver profile not found.' });

    await pool.query(
      'INSERT INTO donation_requests (donor_id, receiver_id, blood_type, units, status, message) VALUES (?, ?, ?, ?, "pending", ?)',
      [donor_id, receivers[0].id, blood_type, units, message]
    );
    res.status(201).json({ success: true, message: 'Blood request submitted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Get receiver's requests
// @route   GET /api/receiver/requests
const getMyRequests = async (req, res) => {
  try {
    const [requests] = await pool.query(`
      SELECT dr.*, u.name AS donor_name, d.blood_type AS donor_blood_type, d.location AS donor_location, d.phone AS donor_phone
      FROM donation_requests dr
      JOIN donors d ON dr.donor_id = d.id
      JOIN users u ON d.user_id = u.id
      JOIN receivers r ON dr.receiver_id = r.id
      WHERE r.user_id = ?
      ORDER BY dr.requested_at DESC
    `, [req.user.id]);
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Get blood stock
// @route   GET /api/receiver/blood-stock
const getBloodStock = async (req, res) => {
  try {
    const [stock] = await pool.query('SELECT * FROM blood_stock ORDER BY blood_type');
    res.json({ success: true, stock });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getReceiverProfile, updateReceiverProfile, searchDonors, createRequest, getMyRequests, getBloodStock };
