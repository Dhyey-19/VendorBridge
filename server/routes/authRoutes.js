import express from 'express';
import { 
  registerCompany, 
  registerVendor, 
  loginUser, 
  loginWithOTP,
  sendOTP,
  getUserProfile, 
  forgotPassword,
  acceptInvite
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public auth pathways
router.post('/register/company', registerCompany);
router.post('/register/vendor', registerVendor);
router.post('/login', loginUser);
router.post('/login-otp', loginWithOTP);
router.post('/send-otp', sendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/accept-invite', acceptInvite);

// Protected profile pathway
router.get('/profile', protect, getUserProfile);

export default router;
