const express = require('express');
const router = express.Router();
const { getReceiverProfile, updateReceiverProfile, searchDonors, createRequest, getMyRequests, getBloodStock } = require('../controllers/receiverController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('receiver'));

router.get('/profile', getReceiverProfile);
router.put('/profile', updateReceiverProfile);
router.get('/search', searchDonors);
router.get('/blood-stock', getBloodStock);
router.post('/requests', createRequest);
router.get('/requests', getMyRequests);

module.exports = router;
