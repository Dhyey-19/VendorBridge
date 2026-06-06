import express from 'express';
import { getCompanyProfile, updateCompanyProfile } from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('company'));

router.route('/profile')
  .get(getCompanyProfile)
  .put(updateCompanyProfile);

export default router;
