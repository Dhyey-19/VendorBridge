import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  logo: String,
  description: String,
  category: {
    type: [String],
    default: []
  },
  gstNumber: {
    type: String,
    trim: true,
    default: ''
  },
  website: String,
  address: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  complianceScore: {
    type: Number,
    default: 100
  },
  rating: {
    type: Number,
    default: 5.0
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  contactPerson: {
    name: String,
    phone: String,
    email: String
  }
}, {
  timestamps: true
});

const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;
