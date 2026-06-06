import express from 'express';
import { protect } from '../middleware/auth.js';
import Vendor from '../models/Vendor.js';

const router = express.Router();

router.get('/me', protect, async (req, res) => {
  try {
    const vendorProfile = await Vendor.findOne({ createdBy: req.user._id });
    res.json(vendorProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/me', protect, async (req, res) => {
  try {
    // Only allow updating certain fields, not status
    const { name, category, gstNumber, contactName, contactEmail, contactPhone } = req.body;
    const vendorProfile = await Vendor.findOneAndUpdate(
      { createdBy: req.user._id },
      { name, category, gstNumber, contactName, contactEmail, contactPhone },
      { new: true }
    );
    res.json(vendorProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const vendor = new Vendor({
      ...req.body,
      createdBy: req.user._id
    });
    const createdVendor = await vendor.save();
    res.status(201).json(createdVendor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json(vendor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
