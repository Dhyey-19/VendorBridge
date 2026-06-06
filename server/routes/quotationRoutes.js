import express from 'express';
import { protect } from '../middleware/auth.js';
import Quotation from '../models/Quotation.js';
import Vendor from '../models/Vendor.js';
import RFQ from '../models/RFQ.js';
import { sendEmail } from '../utils/sendEmail.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'vendor') {
      const vendorProfile = await Vendor.findOne({ createdBy: req.user._id });
      if (!vendorProfile) return res.json([]);
      query = { vendorId: vendorProfile._id };
    }
    const quotations = await Quotation.find(query).populate('rfqId').populate('vendorId').lean();
    
    // Add hasPO flag
    const PurchaseOrder = (await import('../models/PurchaseOrder.js')).default;
    for (let quote of quotations) {
      const po = await PurchaseOrder.findOne({ quotationId: quote._id });
      quote.hasPO = !!po;
    }

    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    let vendorId = req.body.vendorId;
    if (req.user.role === 'vendor') {
      const vendorProfile = await Vendor.findOne({ createdBy: req.user._id });
      vendorId = vendorProfile._id;
    }

    const rfq = await RFQ.findById(req.body.rfqId);
    if (!rfq) return res.status(404).json({ message: 'RFQ not found' });
    
    if (rfq.status !== 'active') {
      return res.status(400).json({ message: 'This RFQ is no longer accepting quotations.' });
    }

    const isExpired = new Date(rfq.deadline).setHours(23, 59, 59, 999) < new Date();
    if (isExpired) {
      return res.status(400).json({ message: 'The deadline for this RFQ has passed.' });
    }

    // Upsert quotation
    let quote = await Quotation.findOne({ rfqId: rfq._id, vendorId });
    if (quote) {
      quote.pricePerUnit = req.body.pricePerUnit;
      quote.totalAmount = req.body.totalAmount;
      quote.deliveryTimeline = req.body.deliveryTimeline;
      quote.notes = req.body.notes;
      await quote.save();
      return res.status(200).json(quote);
    } else {
     const quotation = new Quotation({
      ...req.body,
      vendorId: vendorProfile._id
    });
    await quotation.save();

    const { logActivity } = await import('../utils/logActivity.js');
    await logActivity(req.user._id, `Submitted quotation for RFQ: ${req.body.rfqId}`);

    res.status(201).json(quotation);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const quotation = await Quotation.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('vendorId')
      .populate('rfqId');
      
    if (!quotation) return res.status(404).json({ message: 'Quotation not found' });

    const { logActivity } = await import('../utils/logActivity.js');
    await logActivity(req.user._id, `Updated quotation status to ${status} for RFQ: ${quotation.rfqId.title}`);

    // If accepted, reject other bids and close RFQ
    if (status === 'accepted') {
      await Quotation.updateMany(
        { rfqId: quotation.rfqId._id, _id: { $ne: quotation._id } },
        { status: 'rejected' }
      );
      
      const RFQ = (await import('../models/RFQ.js')).default;
      await RFQ.findByIdAndUpdate(quotation.rfqId._id, { status: 'closed' });

      if (quotation.vendorId && quotation.vendorId.contactEmail) {
        const { sendEmail } = await import('../utils/sendEmail.js');
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #059669;">Quotation Accepted</h2>
            <p>Hello <strong>${quotation.vendorId.contactName || quotation.vendorId.name}</strong>,</p>
            <p>Congratulations! Your quotation for the RFQ <strong>${quotation.rfqId.title}</strong> has been accepted.</p>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0 0 8px;"><strong>Accepted Price:</strong> ₹${quotation.pricePerUnit.toFixed(2)} / unit</p>
              <p style="margin: 0;"><strong>Total Amount:</strong> ₹${quotation.totalAmount.toFixed(2)}</p>
            </div>
            <p>Our team will contact you shortly with the Purchase Order and further instructions.</p>
            <p style="margin-top: 32px; color: #64748b;">Thank you,<br/>VendorBridge Procurement Team</p>
          </div>
        `;
        sendEmail({
          to: quotation.vendorId.contactEmail,
          subject: `Quotation Accepted: ${quotation.rfqId.title}`,
          html: emailHtml
        });
      }
    }

    res.json(quotation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
