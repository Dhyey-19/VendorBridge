import Company from '../models/Company.js';
import Vendor from '../models/Vendor.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendInviteEmail } from '../services/emailService.js';

export const getCompanyProfile = async (req, res) => {
  try {
    const company = await Company.findById(req.user.companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCompanyProfile = async (req, res) => {
  try {
    const company = await Company.findById(req.user.companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    Object.assign(company, req.body);
    const updatedCompany = await company.save();
    res.json(updatedCompany);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVendors = async (req, res) => {
  try {
    const company = await Company.findById(req.user.companyId).populate('vendors');
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company.vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSystemVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({});
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerVendor = async (req, res) => {
  try {
    const { vendorIds, vendorId } = req.body;
    const idsToRegister = vendorIds || (vendorId ? [vendorId] : []);
    
    if (idsToRegister.length === 0) return res.status(400).json({ message: 'Vendor IDs are required' });

    const company = await Company.findById(req.user.companyId);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    // Fetch the actual vendor names to log them properly
    const vendorsToRegister = await Vendor.find({ _id: { $in: idsToRegister } });

    let added = false;
    let addedNames = [];

    vendorsToRegister.forEach(v => {
      if (!company.vendors.includes(v._id.toString()) && !company.vendors.some(existingId => existingId.toString() === v._id.toString())) {
        company.vendors.push(v._id);
        addedNames.push(v.name);
        added = true;
      }
    });

    if (added) {
      // Add activity
      company.activities.push({
        action: 'Vendor Registered',
        details: `Registered ${addedNames.length} new vendor(s): ${addedNames.join(', ')}`,
        user: req.user.name || 'System',
        icon: 'Users',
        color: 'success'
      });
      await company.save();
    }
    
    res.status(201).json({ message: 'Vendors registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all company staff/team members
 * @route   GET /api/companies/team
 * @access  Private (Company users)
 */
export const getCompanyTeam = async (req, res) => {
  try {
    const team = await User.find({ companyId: req.user.companyId }).select('-password');
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    Object.assign(vendor, req.body);
    const updatedVendor = await vendor.save();
    res.json(updatedVendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Add a new internal staff/team member
 * @route   POST /api/companies/team
 * @access  Private (Company admin)
 */
export const addCompanyTeamMember = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!['admin', 'manager', 'officer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role selection' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User account with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      companyId: req.user.companyId,
      status: 'pending',
      isEmailVerified: false
    });

    // Generate secure 24h JWT invitation token
    const inviteToken = jwt.sign(
      { inviteUserId: user._id }, 
      process.env.JWT_SECRET || 'your_jwt_secret_key_here', 
      { expiresIn: '1d' }
    );

    // Build invitation link
    const inviteUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/accept-invite?token=${inviteToken}`;

    const roleLabels = {
      admin: 'Administrator',
      manager: 'Manager',
      officer: 'Procurement Officer'
    };

    // Dispatch email
    await sendInviteEmail(email, name, inviteUrl, roleLabels[role] || role);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      companyId: user.companyId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteVendor = async (req, res) => {
  try {
    const company = await Company.findById(req.user.companyId);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    company.vendors = company.vendors.filter(id => id.toString() !== req.params.id);
    await company.save();

    res.json({ message: 'Vendor removed from company' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update an internal staff/team member's status or role
 * @route   PUT /api/companies/team/:id
 * @access  Private (Company admin)
 */
export const updateCompanyTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, role } = req.body;

    const member = await User.findOne({ _id: id, companyId: req.user.companyId });
    if (!member) {
      return res.status(404).json({ message: 'Team member not found in your company' });
    }

    // Prevent self-deactivation
    if (member._id.toString() === req.user._id.toString() && status === 'inactive') {
      return res.status(400).json({ message: 'You cannot deactivate your own administrative account' });
    }

    if (role && ['admin', 'manager', 'officer'].includes(role)) {
      member.role = role;
    }

    if (status && ['active', 'inactive'].includes(status)) {
      member.status = status;
    }

    const updatedMember = await member.save();
    
    res.json({
      _id: updatedMember._id,
      name: updatedMember.name,
      email: updatedMember.email,
      role: updatedMember.role,
      status: updatedMember.status,
      companyId: updatedMember.companyId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getActivities = async (req, res) => {
  try {
    const company = await Company.findById(req.user.companyId);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    // Sort activities by time descending
    const activities = company.activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
