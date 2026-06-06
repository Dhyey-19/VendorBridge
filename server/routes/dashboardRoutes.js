import express from 'express';
import { protect } from '../middleware/auth.js';
import Vendor from '../models/Vendor.js';
import RFQ from '../models/RFQ.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import Invoice from '../models/Invoice.js';
import Quotation from '../models/Quotation.js';

const router = express.Router();

router.get('/stats', protect, async (req, res) => {
  try {
    let stats = {};
    if (req.user.role === 'vendor') {
      const vendorProfile = await Vendor.findOne({ createdBy: req.user._id });
      const vendorId = vendorProfile ? vendorProfile._id : null;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const activeRfqs = await RFQ.countDocuments({ 
        status: 'active',
        deadline: { $gte: today },
        $or: [
          { assignedVendors: { $size: 0 } },
          { assignedVendors: vendorId }
        ]
      }); 
      const purchaseOrdersCount = vendorId ? await PurchaseOrder.countDocuments({ vendorId }) : 0;
      const invoicesCount = vendorId ? await Invoice.countDocuments({ vendorId }) : 0;
      
      stats = { activeRfqs, purchaseOrdersCount, invoicesCount };
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      stats = {
        vendorsCount: await Vendor.countDocuments(),
        pendingApprovalsCount: await Quotation.countDocuments({ status: 'pending' }),
        activeRfqs: await RFQ.countDocuments({ 
          status: 'active',
          deadline: { $gte: today }
        }),
        purchaseOrdersCount: await PurchaseOrder.countDocuments(),
        invoicesCount: await Invoice.countDocuments()
      };
    }

    const ActivityLog = (await import('../models/ActivityLog.js')).default;
    const logs = await ActivityLog.find()
      .sort('-createdAt')
      .limit(5)
      .populate('userId', 'name');
      
    const recentActivities = logs.map((log, index) => ({
      id: log._id,
      action: log.action,
      time: log.createdAt.toISOString(),
      icon: 'System',
      user: log.userId?.name || 'System'
    }));

    res.json({ ...stats, recentActivities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
