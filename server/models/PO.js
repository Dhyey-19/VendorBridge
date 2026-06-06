import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  poNumber: { type: String, required: true, unique: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  rfqId: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ' },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'completed'], default: 'pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('PO', schema);
