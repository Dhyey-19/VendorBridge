import Vendor from '../models/Vendor.js';

export const getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.user.vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.user.vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }

    Object.assign(vendor, req.body);
    const updatedVendor = await vendor.save();
    res.json(updatedVendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
