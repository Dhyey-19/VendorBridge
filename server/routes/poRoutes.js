import express from 'express';
import { protect } from '../middleware/auth.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import Quotation from '../models/Quotation.js';
import Vendor from '../models/Vendor.js';
import { generatePOPdf } from '../utils/generatePDF.js';
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
    const pos = await PurchaseOrder.find(query)
      .populate('rfqId', 'title quantity deadline')
      .populate('vendorId', 'name contactEmail')
      .sort('-createdAt')
      .lean();

    // Add hasInvoice flag
    const Invoice = (await import('../models/Invoice.js')).default;
    for (let po of pos) {
      const invoice = await Invoice.findOne({ poId: po._id });
      po.hasInvoice = !!invoice;
    }

    res.json(pos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role === 'vendor') {
      return res.status(403).json({ message: 'Vendors cannot generate POs' });
    }

    const { quotationId } = req.body;
    const quotation = await Quotation.findById(quotationId).populate('rfqId').populate('vendorId');
    if (!quotation) return res.status(404).json({ message: 'Quotation not found' });
    if (quotation.status !== 'accepted') return res.status(400).json({ message: 'Quotation is not accepted yet' });

    // Check if PO already exists
    let po = await PurchaseOrder.findOne({ quotationId });
    if (po) {
      return res.status(400).json({ message: 'PO already generated for this quotation' });
    }

    // Generate PO Number
    const poCount = await PurchaseOrder.countDocuments();
    const poNumber = `PO-${new Date().getFullYear()}-${String(poCount + 1).padStart(4, '0')}`;

    po = new PurchaseOrder({
      poNumber,
      rfqId: quotation.rfqId._id,
      quotationId: quotation._id,
      vendorId: quotation.vendorId._id,
      totalAmount: quotation.totalAmount,
    });
    await po.save();

    // Generate PDF Buffer
    const pdfBuffer = await generatePOPdf(po, quotation);

    // Send Email
    let emailSent = false;
    if (quotation.vendorId.contactEmail) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #4f46e5;">Purchase Order Generated</h2>
          <p>Hello <strong>${quotation.vendorId.contactName || quotation.vendorId.name}</strong>,</p>
          <p>Please find attached the Purchase Order <strong>${po.poNumber}</strong> for your recently approved quotation.</p>
          <p><strong>RFQ:</strong> ${quotation.rfqId.title}</p>
          <p><strong>Total Amount:</strong> Rs. ${po.totalAmount.toFixed(2)}</p>
          <p>Please review and acknowledge receipt.</p>
          <p style="margin-top: 32px; color: #64748b;">Thank you,<br/>VendorBridge Procurement Team</p>
        </div>
      `;
      
      const { sendEmail } = await import('../utils/sendEmail.js');
      emailSent = await sendEmail({
        to: quotation.vendorId.contactEmail,
        subject: `Purchase Order ${po.poNumber}`,
        html: emailHtml,
        attachments: [
          {
            filename: `${po.poNumber}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ]
      });
    }

    if (emailSent) {
      po.status = 'sent';
      await po.save();
    }

    const { logActivity } = await import('../utils/logActivity.js');
    await logActivity(req.user._id, `Generated PO: ${po.poNumber}`);

    res.status(201).json(po);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
