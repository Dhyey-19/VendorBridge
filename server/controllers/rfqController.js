import RFQ from '../models/RFQ.js';
import Company from '../models/Company.js';
import Vendor from '../models/Vendor.js';

/**
 * @desc    Get all RFQs for the logged-in company
 * @route   GET /api/companies/rfqs
 * @access  Private (Company staff)
 */
export const getRFQs = async (req, res) => {
  try {
    const rfqs = await RFQ.find({ companyId: req.user.companyId })
      .populate('invitedVendors')
      .sort({ createdAt: -1 });
    res.json(rfqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create a new RFQ
 * @route   POST /api/companies/rfqs
 * @access  Private (Company staff)
 */
export const createRFQ = async (req, res) => {
  try {
    const { title, category, deadline, description, budget, items, status } = req.body;

    if (!title || !deadline) {
      return res.status(400).json({ message: 'Title and deadline are required' });
    }

    const company = await Company.findById(req.user.companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    const rfq = await RFQ.create({
      title,
      category: category || 'Hardware',
      deadline,
      description: description || '',
      budget: budget || 0,
      client: company.name,
      companyId: req.user.companyId,
      items: items || [],
      status: status || 'Active', // Default status from UI
      invitedVendors: []
    });

    res.status(201).json(rfq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get a single RFQ details
 * @route   GET /api/companies/rfqs/:id
 * @access  Private (Company staff)
 */
export const getRFQById = async (req, res) => {
  try {
    const rfq = await RFQ.findOne({ _id: req.params.id, companyId: req.user.companyId })
      .populate('invitedVendors');

    if (!rfq) {
      return res.status(404).json({ message: 'RFQ not found or access denied' });
    }

    res.json(rfq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update RFQ details
 * @route   PUT /api/companies/rfqs/:id
 * @access  Private (Company staff)
 */
export const updateRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.findOne({ _id: req.params.id, companyId: req.user.companyId });

    if (!rfq) {
      return res.status(404).json({ message: 'RFQ not found or access denied' });
    }

    const { title, category, deadline, description, budget, items, status } = req.body;

    if (title) rfq.title = title;
    if (category) rfq.category = category;
    if (deadline) rfq.deadline = deadline;
    if (description !== undefined) rfq.description = description;
    if (budget !== undefined) rfq.budget = budget;
    if (items) rfq.items = items;
    if (status) rfq.status = status;

    const updatedRFQ = await rfq.save();
    await updatedRFQ.populate('invitedVendors');

    res.json(updatedRFQ);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete RFQ
 * @route   DELETE /api/companies/rfqs/:id
 * @access  Private (Company staff)
 */
export const deleteRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.findOneAndDelete({ _id: req.params.id, companyId: req.user.companyId });

    if (!rfq) {
      return res.status(404).json({ message: 'RFQ not found or access denied' });
    }

    res.json({ message: 'RFQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Invite vendor to RFQ
 * @route   POST /api/companies/rfqs/:id/vendors
 * @access  Private (Company staff)
 */
export const inviteVendor = async (req, res) => {
  try {
    const rfq = await RFQ.findOne({ _id: req.params.id, companyId: req.user.companyId });

    if (!rfq) {
      return res.status(404).json({ message: 'RFQ not found or access denied' });
    }

    const { vendorId } = req.body;
    if (!vendorId) {
      return res.status(400).json({ message: 'Vendor ID is required' });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Check if already invited
    if (rfq.invitedVendors.includes(vendorId)) {
      return res.status(400).json({ message: 'Vendor is already invited to this RFQ' });
    }

    rfq.invitedVendors.push(vendorId);
    await rfq.save();
    await rfq.populate('invitedVendors');

    res.json(rfq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Remove vendor from RFQ
 * @route   DELETE /api/companies/rfqs/:id/vendors/:vendorId
 * @access  Private (Company staff)
 */
export const removeVendor = async (req, res) => {
  try {
    const rfq = await RFQ.findOne({ _id: req.params.id, companyId: req.user.companyId });

    if (!rfq) {
      return res.status(404).json({ message: 'RFQ not found or access denied' });
    }

    const { vendorId } = req.params;

    if (!rfq.invitedVendors.includes(vendorId)) {
      return res.status(400).json({ message: 'Vendor is not invited to this RFQ' });
    }

    rfq.invitedVendors = rfq.invitedVendors.filter(id => id.toString() !== vendorId);
    await rfq.save();
    await rfq.populate('invitedVendors');

    res.json(rfq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
