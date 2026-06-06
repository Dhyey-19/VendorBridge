import express from 'express';
import { 
  getCompanyProfile, 
  updateCompanyProfile,
  getCompanyTeam,
  addCompanyTeamMember,
  updateCompanyTeamMember,
  getVendors,
  updateVendor,
  deleteVendor
} from '../controllers/companyController.js';
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

// Team management routes
router.route('/team')
  .get(getCompanyTeam)
  .post(authorize('admin'), addCompanyTeamMember);

router.route('/team/:id')
  .put(authorize('admin'), updateCompanyTeamMember);

export default router;
