import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Company from '../models/Company.js';
import Vendor from '../models/Vendor.js';
import OTP from '../models/OTP.js';
import { sendOTPEmail } from '../services/emailService.js';

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_key_here', {
    expiresIn: '30d',
  });
};

/**
 * @desc    Generate and send a 6-digit OTP code to the requested email
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
export const sendOTP = async (req, res) => {
  const { email, mode } = req.body; // mode: 'signup' | 'login'

  if (!email) {
    return res.status(400).json({ message: 'Email address is required' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (mode === 'login' && !userExists) {
      return res.status(404).json({ message: 'No registered user found with this email' });
    }

    if (mode === 'signup' && userExists) {
      return res.status(400).json({ message: 'An account is already registered with this email' });
    }

    // Generate random 6-digit OTP code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove any existing active OTP codes for this email address to prevent clutter
    await OTP.deleteMany({ email });

    // Save the new OTP
    await OTP.create({
      email,
      otp: generatedOtp
    });

    // Send via email service
    await sendOTPEmail(email, generatedOtp);

    res.json({ message: 'Verification OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Register a new Company and its Admin User (requires OTP check)
 * @route   POST /api/auth/register/company
 * @access  Public
 */
export const registerCompany = async (req, res) => {
  const { email, password, name, companyName, industry, gstNumber, address, otp } = req.body;

  if (!otp) {
    return res.status(400).json({ message: 'Verification OTP is required for registration' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User account with this email already exists' });
    }

    // Verify OTP
    const activeOtp = await OTP.findOne({ email, otp });
    if (!activeOtp) {
      return res.status(400).json({ message: 'Invalid or expired registration OTP' });
    }

    // Delete verified OTP so it cannot be re-used
    await OTP.deleteOne({ _id: activeOtp._id });

    // Create Company
    const company = await Company.create({
      name: companyName || 'New Enterprise Corp',
      industry: industry || 'Technology',
      gstNumber: gstNumber || '',
      address: address || ''
    });

    // Create Admin User for this Company
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
      isEmailVerified: true,
      companyId: company._id
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      companyId: user.companyId,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Register a new Vendor and its Primary Vendor User (requires OTP check)
 * @route   POST /api/auth/register/vendor
 * @access  Public
 */
export const registerVendor = async (req, res) => {
  const { email, password, name, vendorName, category, gstNumber, address, otp } = req.body;

  if (!otp) {
    return res.status(400).json({ message: 'Verification OTP is required for registration' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User account with this email already exists' });
    }

    // Verify OTP
    const activeOtp = await OTP.findOne({ email, otp });
    if (!activeOtp) {
      return res.status(400).json({ message: 'Invalid or expired registration OTP' });
    }

    // Delete verified OTP so it cannot be re-used
    await OTP.deleteOne({ _id: activeOtp._id });

    // Create Vendor profile
    const vendor = await Vendor.create({
      name: vendorName || 'New Vendor Shop',
      category: category ? (Array.isArray(category) ? category : [category]) : [],
      gstNumber: gstNumber || '',
      address: address || '',
      status: 'Pending'
    });

    // Create Vendor User
    const user = await User.create({
      name,
      email,
      password,
      role: 'vendor',
      isEmailVerified: true,
      vendorId: vendor._id
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      vendorId: user.vendorId,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Authenticate User using standard email & password
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'Account is deactivated. Contact administrator.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      companyId: user.companyId,
      vendorId: user.vendorId,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Authenticate User using passwordless email OTP
 * @route   POST /api/auth/login-otp
 * @access  Public
 */
export const loginWithOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and verification OTP are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No registered user found with this email' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'Account is deactivated. Contact administrator.' });
    }

    // Verify OTP
    const activeOtp = await OTP.findOne({ email, otp });
    if (!activeOtp) {
      return res.status(400).json({ message: 'Invalid or expired login OTP' });
    }

    // Delete verified OTP code
    await OTP.deleteOne({ _id: activeOtp._id });

    // Mark email as verified if it wasn't already (e.g. from older schemas)
    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      companyId: user.companyId,
      vendorId: user.vendorId,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('companyId')
      .populate('vendorId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Mock password recovery endpoint
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No user registered with this email address' });
    }

    console.log(`Password reset link generated for email: ${email}`);
    res.json({ 
      message: 'Password reset link has been dispatched to your registered email address ( ERP Simulated )' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Accept team invitation, activate user and log in automatically
 * @route   POST /api/auth/accept-invite
 * @access  Public
 */
export const acceptInvite = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Invitation token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    
    if (!decoded.inviteUserId) {
      return res.status(400).json({ message: 'Invalid invitation token payload' });
    }

    const user = await User.findById(decoded.inviteUserId);
    if (!user) {
      return res.status(404).json({ message: 'Invited user account not found' });
    }

    if (user.status === 'active') {
      return res.status(400).json({ message: 'Invitation has already been accepted' });
    }

    if (user.status === 'inactive') {
      return res.status(400).json({ message: 'This account has been deactivated by administration' });
    }

    // Activate the user
    user.status = 'active';
    user.isEmailVerified = true;
    await user.save();

    // Generate login token
    const loginToken = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      companyId: user.companyId,
      token: loginToken
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'The invitation link has expired. Please ask your administrator to send a new invite.' });
    }
    res.status(400).json({ message: 'Invalid or corrupted invitation link' });
  }
};
