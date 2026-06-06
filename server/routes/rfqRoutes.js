import express from 'express';
import { protect } from '../middleware/auth.js';
import RFQ from '../models/RFQ.js';
import Vendor from '../models/Vendor.js';
import { sendEmail } from '../utils/sendEmail.js';
import { logActivity } from '../utils/logActivity.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'vendor') {
      const vendorProfile = await Vendor.findOne({ createdBy: req.user._id });
      if (vendorProfile) {
        query = { 
          $or: [
            { assignedVendors: { $size: 0 } }, 
            { assignedVendors: vendorProfile._id }
          ]
        };
      } else {
        return res.json([]);
      }
    }
    const rfqs = await RFQ.find(query)
      .populate('createdBy', 'name')
      .populate('assignedVendors', 'name category')
      .sort('-createdAt');
    res.json(rfqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role === 'vendor') return res.status(403).json({ message: 'Not authorized' });
    
    const rfq = await RFQ.create({
      ...req.body,
      createdBy: req.user._id
    });

    await logActivity(req.user._id, `Created new RFQ: ${rfq.title}`);

    // Send email to assigned vendors
    if (req.body.assignedVendors && req.body.assignedVendors.length > 0) {
      const vendors = await Vendor.find({ _id: { $in: req.body.assignedVendors } });
      const emails = vendors.map(v => v.contactEmail).filter(Boolean);
      
      if (emails.length > 0) {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #4f46e5;">New RFQ Invitation</h2>
            <p>Hello,</p>
            <p>You have been invited to submit a quotation for a new Request for Quotation (RFQ).</p>
            <p><strong>RFQ Title:</strong> ${rfq.title}</p>
            <p><strong>Quantity:</strong> ${rfq.quantity}</p>
            <p><strong>Deadline:</strong> ${new Date(rfq.deadline).toLocaleDateString()}</p>
            <p>Please log in to the VendorBridge portal to view details and submit your bid.</p>
            <p style="margin-top: 32px; color: #64748b;">Best regards,<br/>VendorBridge Procurement Team</p>
          </div>
        `;
        
        await sendEmail({
          to: emails.join(','),
          subject: `New RFQ Invitation: ${rfq.title}`,
          html: emailHtml
        });
      }
    }

    res.status(201).json(rfq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    if (req.user.role === 'vendor') return res.status(403).json({ message: 'Not authorized' });
    const rfq = await RFQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!rfq) return res.status(404).json({ message: 'RFQ not found' });
    await logActivity(req.user._id, `Updated RFQ: ${rfq.title}`);
    res.json(rfq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    if (req.user.role === 'vendor') return res.status(403).json({ message: 'Not authorized' });
    const rfq = await RFQ.findById(req.params.id);
    if (!rfq) return res.status(404).json({ message: 'RFQ not found' });
    await RFQ.findByIdAndDelete(req.params.id);
    await logActivity(req.user._id, `Deleted RFQ: ${rfq.title}`);
    res.json({ message: 'RFQ deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
