import dotenv from 'dotenv';
import connectDB from './config/db.js';
import mongoose from 'mongoose';
import { registerCompany, registerVendor, loginUser } from './controllers/authController.js';
import User from './models/User.js';
import Company from './models/Company.js';
import Vendor from './models/Vendor.js';

// Load env variables
dotenv.config();

// Stub Response Mock
const mockResponse = () => {
  const res = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.jsonData = data;
    return res;
  };
  return res;
};

const runTest = async () => {
  try {
    await connectDB();
    console.log('--- Cleaning previous test data ---');
    const existingUsers = await User.find({ email: { $in: ['testcompany@test.com', 'testvendor@test.com'] } });
    for (const u of existingUsers) {
      if (u.companyId) await Company.findByIdAndDelete(u.companyId);
      if (u.vendorId) await Vendor.findByIdAndDelete(u.vendorId);
      await User.findByIdAndDelete(u._id);
    }

    console.log('--- Test 1: Register Company (Admin User) ---');
    const req1 = {
      body: {
        email: 'testcompany@test.com',
        password: 'password123',
        name: 'John Company Admin',
        companyName: 'Apex Procurement Inc',
        industry: 'Logistics',
        gstNumber: 'GSTIN12345COMPANY',
        address: 'Mumbai Headquarters'
      }
    };
    const res1 = mockResponse();
    await registerCompany(req1, res1);
    
    if (res1.statusCode === 201 || !res1.statusCode) {
      console.log('✅ Company Registered Successfully!');
      console.log('   Token generated:', res1.jsonData.token ? 'YES' : 'NO');
      console.log('   Role matches:', res1.jsonData.role === 'admin' ? 'YES (admin)' : 'NO');
    } else {
      console.log('❌ Company Registration Failed:', res1.jsonData);
    }
    
    console.log('--- Test 2: Register Vendor ---');
    const req2 = {
      body: {
        email: 'testvendor@test.com',
        password: 'password123',
        name: 'Gopal Vendor Owner',
        vendorName: 'Gopal Logistics Services',
        category: 'Transportation',
        gstNumber: 'GSTIN54321VENDOR',
        address: 'Delhi Hub'
      }
    };
    const res2 = mockResponse();
    await registerVendor(req2, res2);
    
    if (res2.statusCode === 201 || !res2.statusCode) {
      console.log('✅ Vendor Registered Successfully!');
      console.log('   Role matches:', res2.jsonData.role === 'vendor' ? 'YES (vendor)' : 'NO');
      console.log('   Status matches:', res2.jsonData.status === 'active' ? 'YES (active)' : 'NO');
    } else {
      console.log('❌ Vendor Registration Failed:', res2.jsonData);
    }
    
    console.log('--- Test 3: Login User (Company Admin) ---');
    const req3 = {
      body: {
        email: 'testcompany@test.com',
        password: 'password123'
      }
    };
    const res3 = mockResponse();
    await loginUser(req3, res3);
    
    if (res3.jsonData && res3.jsonData.token) {
      console.log('✅ Company Admin Login Successful!');
    } else {
      console.log('❌ Company Admin Login Failed:', res3.jsonData);
    }

    console.log('--- Test 4: Login User (Vendor Owner) ---');
    const req4 = {
      body: {
        email: 'testvendor@test.com',
        password: 'password123'
      }
    };
    const res4 = mockResponse();
    await loginUser(req4, res4);
    
    if (res4.jsonData && res4.jsonData.token) {
      console.log('✅ Vendor Login Successful!');
    } else {
      console.log('❌ Vendor Login Failed:', res4.jsonData);
    }

    console.log('--- Test 5: Verify models structure & Populated relationship in DB ---');
    const dbUser = await User.findOne({ email: 'testvendor@test.com' }).populate('vendorId');
    if (dbUser && dbUser.vendorId && dbUser.vendorId.gstNumber === 'GSTIN54321VENDOR') {
      console.log('✅ DB references populated correctly and Vendor matches!');
      console.log(`   Vendor name in DB: ${dbUser.vendorId.name}`);
      console.log(`   Vendor GST: ${dbUser.vendorId.gstNumber}`);
    } else {
      console.log('❌ DB verification failed');
    }
    
    console.log('--- Clean up test entries ---');
    const cleanupUsers = await User.find({ email: { $in: ['testcompany@test.com', 'testvendor@test.com'] } });
    for (const u of cleanupUsers) {
      if (u.companyId) await Company.findByIdAndDelete(u.companyId);
      if (u.vendorId) await Vendor.findByIdAndDelete(u.vendorId);
      await User.findByIdAndDelete(u._id);
    }
    console.log('✅ Test data cleaned cleanly.');
    
    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Test script execution crashed:', error);
    process.exit(1);
  }
};

runTest();
