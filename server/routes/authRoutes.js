import express from 'express';
import { 
  registerCompany, 
  registerVendor, 
  loginUser, 
  getUserProfile, 
  forgotPassword 
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public auth pathways
router.post('/register/company', registerCompany);
router.post('/register/vendor', registerVendor);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);

// Protected profile pathway
router.get('/profile', protect, getUserProfile);

export default router;
