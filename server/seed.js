import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Vendor from './models/Vendor.js';
import RFQ from './models/RFQ.js';
import Quotation from './models/Quotation.js';
import PurchaseOrder from './models/PurchaseOrder.js';
import Invoice from './models/Invoice.js';
import ActivityLog from './models/ActivityLog.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB. Clearing existing data...');

    await User.deleteMany({});
    await Vendor.deleteMany({});
    await RFQ.deleteMany({});
    await Quotation.deleteMany({});
    await PurchaseOrder.deleteMany({});
    await Invoice.deleteMany({});
    await ActivityLog.deleteMany({});

    console.log('Cleared all collections.');

    // 1. Create Admin
    const admin = await User.create({ email: 'admin@globalprocure.com', password: 'Password123!', role: 'admin', name: 'Admin User' });

    // 2. Create 10 Vendors
    const vendorData = [
      { name: 'TechNova Solutions', category: 'IT Hardware', email: 'sales@technova.com' },
      { name: 'Apex Logistics', category: 'Logistics', email: 'contact@apexlogistics.in' },
      { name: 'Global Office Supplies', category: 'Office Supplies', email: 'orders@globaloffice.com' },
      { name: 'Prime Manufacturing', category: 'Raw Materials', email: 'info@primemanufacturing.com' },
      { name: 'CloudNet Systems', category: 'IT Software', email: 'sales@cloudnetsystems.com' },
      { name: 'BuildRight Construction', category: 'Infrastructure', email: 'projects@buildright.com' },
      { name: 'EcoPack Solutions', category: 'Packaging', email: 'hello@ecopack.com' },
      { name: 'NextGen Robotics', category: 'Machinery', email: 'sales@nextgenrobotics.com' },
      { name: 'Swift Couriers', category: 'Logistics', email: 'support@swiftcouriers.com' },
      { name: 'Lumina Lighting', category: 'Electrical', email: 'b2b@luminalighting.com' }
    ];

    const vendorUsers = [];
    const vendors = [];

    for (let i = 0; i < vendorData.length; i++) {
      const vData = vendorData[i];
      const isDhyey = i === 0;
      const user = await User.create({ 
        email: isDhyey ? 'dhyeyshah009@gmail.com' : vData.email, 
        password: isDhyey ? '000000' : 'Password123!', 
        role: 'vendor', 
        name: vData.name 
      });
      vendorUsers.push(user);

      const vendor = await Vendor.create({
        name: vData.name,
        category: vData.category,
        gstNumber: `29ABCDE1234F1Z${i}`,
        contactName: `John ${vData.name.split(' ')[0]}`,
        contactEmail: isDhyey ? 'dhyeyshah009@gmail.com' : vData.email,
        contactPhone: `+91 987654321${i}`,
        businessAddress: `${i + 10} Industrial Area, Tech City`,
        status: 'approved',
        createdBy: user._id
      });
      vendors.push(vendor);
    }

    console.log('Created Admin and 10 Vendors.');

    const today = new Date();

    // 3. Create RFQs
    const rfq1 = await RFQ.create({
      title: '500 Dell Latitude Laptops',
      description: 'Need 500 laptops for new employee onboarding. 16GB RAM, 512GB SSD.',
      quantity: 500,
      deadline: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // Next week
      status: 'active',
      assignedVendors: [],
      createdBy: admin._id
    });

    const rfq2 = await RFQ.create({
      title: 'Monthly Office Stationaries',
      description: 'A4 Paper, Pens, Whiteboards, Markers.',
      quantity: 1000,
      deadline: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // In 2 days
      status: 'active',
      assignedVendors: [vendors[2]._id, vendors[3]._id, vendors[6]._id],
      createdBy: admin._id
    });

    const rfq3 = await RFQ.create({
      title: 'Warehouse Racking System',
      description: 'Heavy duty steel racking system for new 10,000 sq ft warehouse.',
      quantity: 50,
      deadline: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000), // Next 2 weeks
      status: 'closed', // Will be closed because we accepted a quotation
      assignedVendors: [vendors[5]._id, vendors[7]._id],
      createdBy: admin._id
    });

    const rfq4 = await RFQ.create({
      title: 'Logistics Fleet Tracking Software',
      description: 'GPS tracking software for 200 delivery trucks.',
      quantity: 200,
      deadline: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // In 5 days
      status: 'closed',
      assignedVendors: [vendors[0]._id, vendors[4]._id],
      createdBy: admin._id
    });

    const rfq5 = await RFQ.create({
      title: 'Annual Packaging Material',
      description: 'Corrugated boxes and bubble wrap for shipments.',
      quantity: 5000,
      deadline: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // Expired 2 days ago
      status: 'active',
      assignedVendors: [vendors[6]._id],
      createdBy: admin._id
    });

    console.log('Created RFQs.');

    // 4. Create Quotations for RFQ 2 (Active, multiple pending)
    await Quotation.create([
      { rfqId: rfq2._id, vendorId: vendors[2]._id, pricePerUnit: 25, totalAmount: 25000, deliveryTimeline: '1 week', status: 'pending' },
      { rfqId: rfq2._id, vendorId: vendors[3]._id, pricePerUnit: 22, totalAmount: 22000, deliveryTimeline: '2 weeks', status: 'pending' },
      { rfqId: rfq2._id, vendorId: vendors[6]._id, pricePerUnit: 28, totalAmount: 28000, deliveryTimeline: '3 days', status: 'pending' }
    ]);

    // Quotations for RFQ 3 (Closed, PO generated, Invoice pending)
    const quote3_win = await Quotation.create({ rfqId: rfq3._id, vendorId: vendors[7]._id, pricePerUnit: 15000, totalAmount: 750000, deliveryTimeline: '1 month', status: 'accepted' });
    await Quotation.create({ rfqId: rfq3._id, vendorId: vendors[5]._id, pricePerUnit: 16500, totalAmount: 825000, deliveryTimeline: '3 weeks', status: 'rejected' });

    // Quotations for RFQ 4 (Closed, PO generated, Invoice paid)
    const quote4_win = await Quotation.create({ rfqId: rfq4._id, vendorId: vendors[4]._id, pricePerUnit: 500, totalAmount: 100000, deliveryTimeline: 'Immediate', status: 'accepted' });
    await Quotation.create({ rfqId: rfq4._id, vendorId: vendors[0]._id, pricePerUnit: 550, totalAmount: 110000, deliveryTimeline: '1 week', status: 'rejected' });

    console.log('Created Quotations.');

    // 5. Create POs and Invoices for RFQ 3
    const po3 = await PurchaseOrder.create({
      poNumber: `PO-${Date.now()}-3`,
      rfqId: rfq3._id,
      quotationId: quote3_win._id,
      vendorId: quote3_win.vendorId,
      totalAmount: quote3_win.totalAmount,
      status: 'sent',
      hasInvoice: true
    });

    const inv3 = await Invoice.create({
      invoiceNumber: `INV-${Date.now()}-3`,
      poId: po3._id,
      vendorId: po3.vendorId,
      totalAmount: po3.totalAmount,
      status: 'unpaid' // Unpaid
    });

    // PO and Invoice for RFQ 4 (Paid)
    const po4 = await PurchaseOrder.create({
      poNumber: `PO-${Date.now()}-4`,
      rfqId: rfq4._id,
      quotationId: quote4_win._id,
      vendorId: quote4_win.vendorId,
      totalAmount: quote4_win.totalAmount,
      status: 'sent',
      hasInvoice: true
    });

    const inv4 = await Invoice.create({
      invoiceNumber: `INV-${Date.now()}-4`,
      poId: po4._id,
      vendorId: po4.vendorId,
      totalAmount: po4.totalAmount,
      status: 'paid'
    });

    console.log('Created Purchase Orders and Invoices.');

    // 6. Generate Activity Logs to make the dashboard look alive
    await ActivityLog.create([
      { userId: admin._id, action: 'Created new RFQ: 500 Dell Latitude Laptops', createdAt: new Date(today.getTime() - 6 * 60 * 60 * 1000) },
      { userId: vendorUsers[2]._id, action: 'Submitted quotation for RFQ: Monthly Office Stationaries', createdAt: new Date(today.getTime() - 5 * 60 * 60 * 1000) },
      { userId: vendorUsers[3]._id, action: 'Submitted quotation for RFQ: Monthly Office Stationaries', createdAt: new Date(today.getTime() - 4 * 60 * 60 * 1000) },
      { userId: admin._id, action: `Generated PO: ${po3.poNumber}`, createdAt: new Date(today.getTime() - 3 * 60 * 60 * 1000) },
      { userId: vendorUsers[7]._id, action: `Submitted Invoice: ${inv3.invoiceNumber}`, createdAt: new Date(today.getTime() - 2 * 60 * 60 * 1000) },
      { userId: admin._id, action: `Updated Invoice status to paid: ${inv4.invoiceNumber}`, createdAt: new Date(today.getTime() - 1 * 60 * 60 * 1000) },
    ]);

    console.log('Created Activity Logs.');
    console.log('Database successfully seeded with workflow-accurate data!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed();
