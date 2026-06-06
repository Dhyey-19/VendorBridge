import express from 'express';
import { 
  getCompanyProfile, 
  updateCompanyProfile,
  getCompanyTeam,
  addCompanyTeamMember,
  updateCompanyTeamMember,
  getVendors,
  updateVendor,
  deleteVendor,
  getSystemVendors,
  registerVendor,
  getActivities
} from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('company', 'admin', 'manager', 'officer'));

router.route('/profile')
  .get(getCompanyProfile)
  .put(updateCompanyProfile);

router.route('/vendors')
  .get(getVendors)
  .post(registerVendor);

router.route('/system-vendors')
  .get(getSystemVendors);

router.route('/vendors/:id')
  .put(updateVendor)
  .delete(deleteVendor);

// Team management routes
router.route('/team')
  .get(getCompanyTeam)
  .post(authorize('admin'), addCompanyTeamMember);

router.route('/team/:id')
  .put(authorize('admin'), updateCompanyTeamMember);

router.route('/activities')
  .get(getActivities);

export default router;
