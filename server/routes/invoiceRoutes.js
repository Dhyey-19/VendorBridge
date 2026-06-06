import express from 'express';
import { protect } from '../middleware/auth.js';
import Invoice from '../models/Invoice.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import Vendor from '../models/Vendor.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'vendor') {
      const vendorProfile = await Vendor.findOne({ createdBy: req.user._id });
      if (!vendorProfile) return res.json([]);
      query = { vendorId: vendorProfile._id };
    }
    const invoices = await Invoice.find(query)
      .populate({ path: 'poId', populate: { path: 'rfqId' } })
      .populate('vendorId', 'name contactEmail')
      .sort('-createdAt');
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'vendor') {
      return res.status(403).json({ message: 'Only vendors can generate invoices' });
    }

    const { poId } = req.body;
    const po = await PurchaseOrder.findById(poId).populate('rfqId');
    if (!po) return res.status(404).json({ message: 'Purchase Order not found' });

    // Ensure Vendor owns this PO
    const vendorProfile = await Vendor.findOne({ createdBy: req.user._id });
    if (!vendorProfile || po.vendorId.toString() !== vendorProfile._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to invoice this PO' });
    }

    // Check if invoice already exists
    let invoice = await Invoice.findOne({ poId });
    if (invoice) {
      return res.status(400).json({ message: 'Invoice already generated for this PO' });
    }

    // Generate Invoice Number
    const invoiceCount = await Invoice.countDocuments();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(4, '0')}`;

    invoice = new Invoice({
      invoiceNumber,
      poId: po._id,
      vendorId: po.vendorId,
      totalAmount: po.totalAmount,
      createdBy: req.user._id
    });
    
    await invoice.save();
    po.hasInvoice = true;
    await po.save();
    
    const { logActivity } = await import('../utils/logActivity.js');
    await logActivity(req.user._id, `Submitted Invoice: ${invoice.invoiceNumber}`);

    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id/status', protect, async (req, res) => {
  try {
    if (req.user.role === 'vendor') {
      return res.status(403).json({ message: 'Vendors cannot update invoice status' });
    }

    const { status } = req.body;
    if (!['pending', 'paid', 'rejected', 'unpaid'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const invoice = await Invoice.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('vendorId');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    
    const { logActivity } = await import('../utils/logActivity.js');
    await logActivity(req.user._id, `Updated Invoice status to ${status}: ${invoice.invoiceNumber}`);

    if (status === 'paid' && invoice.vendorId && invoice.vendorId.contactEmail) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #059669;">Payment Confirmation</h2>
          <p>Hello <strong>${invoice.vendorId.contactName || invoice.vendorId.name}</strong>,</p>
          <p>We are pleased to inform you that your invoice <strong>${invoice.invoiceNumber}</strong> for the amount of <strong>Rs. ${invoice.totalAmount?.toFixed(2)}</strong> has been successfully paid.</p>
          <p>Thank you for your valuable service and prompt delivery. We look forward to continuing our successful partnership with you.</p>
          <p style="margin-top: 32px; color: #64748b;">Best regards,<br/>VendorBridge Procurement Team</p>
        </div>
      `;
      
      const { sendEmail } = await import('../utils/sendEmail.js');
      await sendEmail({
        to: invoice.vendorId.contactEmail,
        subject: `Payment Processed: Invoice ${invoice.invoiceNumber}`,
        html: emailHtml
      });
    }

    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
