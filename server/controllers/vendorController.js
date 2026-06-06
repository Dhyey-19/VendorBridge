import Vendor from '../models/Vendor.js';
import RFQ from '../models/RFQ.js';
import Quotation from '../models/Quotation.js';
import PurchaseOrder from '../models/PurchaseOrder.js';

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

export const getOpenRFQs = async (req, res) => {
  try {
    const rfqs = await RFQ.find({ status: 'Open' }).populate('companyId', 'name');
    res.json(rfqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitQuotation = async (req, res) => {
  try {
    const { rfpId, amount, proposal } = req.body;
    const quotation = new Quotation({
      rfpId,
      vendorId: req.user.vendorId,
      amount,
      proposal
    });
    const created = await quotation.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find({ vendorId: req.user.vendorId }).populate('rfpId', 'title client');
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyPurchaseOrders = async (req, res) => {
  try {
    const pos = await PurchaseOrder.find({ vendorId: req.user.vendorId }).populate({ path: 'quotationId', populate: { path: 'rfpId' } }).populate('companyId', 'name');
    res.json(pos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
