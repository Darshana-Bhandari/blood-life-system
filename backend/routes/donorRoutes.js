const express = require('express');
const router = express.Router();
const { getDonorProfile, updateDonorProfile, getMyDonations, createDonation, getBloodStock } = require('../controllers/donorController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('donor'));

router.get('/profile', getDonorProfile);
router.put('/profile', updateDonorProfile);
router.get('/donations', getMyDonations);
router.post('/donations', createDonation);
router.get('/blood-stock', getBloodStock);

module.exports = router;
