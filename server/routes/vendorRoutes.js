import express from 'express';
import { getVendorProfile, updateVendorProfile } from '../controllers/vendorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('vendor'));

router.route('/profile')
  .get(getVendorProfile)
  .put(updateVendorProfile);

export default router;
