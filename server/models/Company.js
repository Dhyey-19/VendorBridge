import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  industry: String,
  companySize: String,
  registrationNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  gstNumber: {
    type: String,
    trim: true,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  website: String,
  contactPerson: {
    name: String,
    phone: String,
    email: String
  },
  vendors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  }],
  activities: [{
    action: String,
    details: String,
    user: String,
    icon: String,
    color: String,
    time: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

const Company = mongoose.model('Company', companySchema);
export default Company;
