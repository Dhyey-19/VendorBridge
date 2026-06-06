import express from 'express';
import { getCompanyProfile, updateCompanyProfile, getVendors, updateVendor, deleteVendor } from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('company', 'admin', 'manager', 'officer'));

router.route('/profile')
  .get(getCompanyProfile)
  .put(updateCompanyProfile);

router.route('/vendors')
  .get(getVendors);

router.route('/vendors/:id')
  .put(updateVendor)
  .delete(deleteVendor);

export default router;
