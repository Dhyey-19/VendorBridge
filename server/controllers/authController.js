import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Company from '../models/Company.js';
import Vendor from '../models/Vendor.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_key_here', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res) => {
  const { email, password, role, name } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let companyId = null;
    let vendorId = null;

    if (role === 'company') {
      const company = await Company.create({ name: name || 'New Enterprise' });
      companyId = company._id;
    } else if (role === 'vendor') {
      const vendor = await Vendor.create({ name: name || 'New Vendor Shop' });
      vendorId = vendor._id;
    } else {
      return res.status(400).json({ message: 'Invalid role. Must be company or vendor.' });
    }

    const user = await User.create({
      email,
      password,
      role,
      companyId,
      vendorId
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        vendorId: user.vendorId,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
