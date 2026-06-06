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
  website: String,
  contactPerson: {
    name: String,
    phone: String,
    email: String
  }
}, {
  timestamps: true
});

const Company = mongoose.model('Company', companySchema);
export default Company;
