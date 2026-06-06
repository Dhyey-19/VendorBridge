import mongoose from 'mongoose';

const rfqSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  client: {
    type: String, // Or ObjectId referencing Company
    required: false,
    default: ''
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  budget: {
    type: Number,
    required: false,
    default: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Open', 'Closed', 'Awarded', 'Active', 'Draft'], // support Active and Draft status from the UI
    default: 'Open'
  },
  category: {
    type: String,
    default: 'Hardware'
  },
  description: {
    type: String,
    default: ''
  },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      uom: { type: String, default: 'Nos' }
    }
  ],
  invitedVendors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor'
    }
  ]
}, {
  timestamps: true
});

const RFQ = mongoose.model('RFQ', rfqSchema);
export default RFQ;
