import express from 'express';
import { 
  getVendorProfile, 
  updateVendorProfile,
  getOpenRFQs,
  submitQuotation,
  getMyQuotations,
  getMyPurchaseOrders
} from '../controllers/vendorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('vendor'));

router.route('/profile')
  .get(getVendorProfile)
  .put(updateVendorProfile);

router.route('/rfqs')
  .get(getOpenRFQs);

router.route('/quotations')
  .get(getMyQuotations)
  .post(submitQuotation);

router.route('/purchase-orders')
  .get(getMyPurchaseOrders);

export default router;
