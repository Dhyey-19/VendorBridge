import mongoose from 'mongoose';

const poSchema = new mongoose.Schema({
  poNumber: { type: String, required: true, unique: true },
  rfqId: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ', required: true },
  quotationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'sent', 'acknowledged', 'completed'], default: 'pending' },
}, { timestamps: true });

const PurchaseOrder = mongoose.model('PurchaseOrder', poSchema);
export default PurchaseOrder;
