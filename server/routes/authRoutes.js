import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret_key_here', { expiresIn: '30d' });
    res.json({ user: { id: user._id, name: user.name, role: user.role, email: user.email }, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const validRole = ['admin', 'manager', 'officer', 'vendor'].includes(role) ? role : 'vendor';

    const user = await User.create({
      email,
      password,
      name,
      role: validRole
    });

    if (validRole === 'vendor') {
      import('../models/Vendor.js').then(async ({ default: Vendor }) => {
        await Vendor.create({
          name: name,
          category: 'Uncategorized',
          gstNumber: 'PENDING',
          contactName: name,
          contactEmail: email,
          status: 'pending',
          createdBy: user._id
        });
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret_key_here', { expiresIn: '30d' });
    res.status(201).json({ user: { id: user._id, name: user.name, role: user.role, email: user.email }, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
