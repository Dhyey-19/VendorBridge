import express from 'express';
import { 
  getCompanyProfile, 
  updateCompanyProfile,
  getCompanyTeam,
  addCompanyTeamMember,
  updateCompanyTeamMember
} from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Apply company roles check to all company endpoints
router.use(authorize('admin', 'manager', 'officer'));

router.route('/profile')
  .get(getCompanyProfile)
  .put(updateCompanyProfile);

// Team management routes
router.route('/team')
  .get(getCompanyTeam)
  .post(authorize('admin'), addCompanyTeamMember);

router.route('/team/:id')
  .put(authorize('admin'), updateCompanyTeamMember);

export default router;
