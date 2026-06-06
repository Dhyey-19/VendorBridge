import mongoose from 'mongoose';

const rfqSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  client: {
    type: String, // Or ObjectId referencing Company
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Open', 'Closed', 'Awarded'],
    default: 'Open'
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

const RFQ = mongoose.model('RFQ', rfqSchema);
export default RFQ;
