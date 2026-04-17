const express = require('express');
const router = express.Router();
const {
  getAllUsers, getUserById, updateUser, deleteUser,
  getDashboardStats, getAllDonations, updateDonationStatus,
  getBloodStock, updateBloodStock,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/donations', getAllDonations);
router.put('/donations/:id', updateDonationStatus);
router.get('/blood-stock', getBloodStock);
router.put('/blood-stock', updateBloodStock);

module.exports = router;
