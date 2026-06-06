import mongoose from 'mongoose';

const schema = new mongoose.Schema({ 
  name: { type: String, required: true }, 
  category: { type: String, required: true }, 
  gstNumber: { type: String, required: true },
  contactName: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, 
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
}, { timestamps: true });

export default mongoose.model('Vendor', schema);
