import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  logo: String,
  description: String,
  category: [String],
  website: String,
  complianceScore: {
    type: Number,
    default: 100
  },
  rating: {
    type: Number,
    default: 5.0
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
