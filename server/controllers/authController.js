import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Company from '../models/Company.js';
import Vendor from '../models/Vendor.js';

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_key_here', {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register a new Company and its Admin User
 * @route   POST /api/auth/register/company
 * @access  Public
 */
export const registerCompany = async (req, res) => {
  const { email, password, name, companyName, industry, gstNumber, address } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User account with this email already exists' });
    }

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
      companyId: company._id
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      companyId: user.companyId,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Register a new Vendor and its Primary Vendor User
 * @route   POST /api/auth/register/vendor
 * @access  Public
 */
export const registerVendor = async (req, res) => {
  const { email, password, name, vendorName, category, gstNumber, address } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User account with this email already exists' });
    }

    // Create Vendor profile
    const vendor = await Vendor.create({
      name: vendorName || 'New Vendor Shop',
      category: category ? (Array.isArray(category) ? category : [category]) : [],
      gstNumber: gstNumber || '',
      address: address || '',
      status: 'Pending' // Requires Admin approval in ERP workflow
    });

    // Create Vendor User
    const user = await User.create({
      name,
      email,
      password,
      role: 'vendor',
      vendorId: vendor._id
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      vendorId: user.vendorId,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Authenticate User & get token
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

    // ERP stub: Log recovery trigger and respond
    console.log(`Password reset link generated for email: ${email}`);
    res.json({ 
      message: 'Password reset link has been dispatched to your registered email address ( ERP Simulated )' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
