import dotenv from 'dotenv';
import connectDB from './config/db.js';
import mongoose from 'mongoose';
import { sendOTP, registerCompany, loginWithOTP } from './controllers/authController.js';
import User from './models/User.js';
import Company from './models/Company.js';
import OTP from './models/OTP.js';

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
    const existingUsers = await User.find({ email: 'testotp@example.com' });
    for (const u of existingUsers) {
      if (u.companyId) await Company.findByIdAndDelete(u.companyId);
      await User.findByIdAndDelete(u._id);
    }
    await OTP.deleteMany({ email: 'testotp@example.com' });

    console.log('\n--- Test 1: Send OTP to testotp@example.com ---');
    const req1 = {
      body: {
        email: 'testotp@example.com',
        mode: 'signup'
      }
    };
    const res1 = mockResponse();
    await sendOTP(req1, res1);

    if (res1.jsonData && res1.jsonData.message.includes('Verification OTP sent')) {
      console.log('✅ OTP Dispatch Successful!');
    } else {
      console.log('❌ OTP Dispatch Failed:', res1.jsonData);
    }

    // Retrieve the OTP that was saved in the DB
    const dbOtpRecord = await OTP.findOne({ email: 'testotp@example.com' });
    if (!dbOtpRecord) {
      throw new Error('OTP was not saved in the database!');
    }
    const correctOtp = dbOtpRecord.otp;
    console.log(`🔑 Retrieved OTP from DB: ${correctOtp}`);

    console.log('\n--- Test 2: Register Company with INVALID OTP ---');
    const req2 = {
      body: {
        email: 'testotp@example.com',
        password: 'password123',
        name: 'Gopal Admin Test',
        companyName: 'Gopal Tech Solutions',
        otp: '999999' // Invalid code
      }
    };
    const res2 = mockResponse();
    await registerCompany(req2, res2);

    if (res2.statusCode === 400 && res2.jsonData.message.includes('Invalid or expired')) {
      console.log('✅ Registration successfully BLOCKED on invalid OTP!');
    } else {
      console.log('❌ Error: Registration was not blocked!', res2.statusCode, res2.jsonData);
    }

    console.log('\n--- Test 3: Register Company with VALID OTP ---');
    const req3 = {
      body: {
        email: 'testotp@example.com',
        password: 'password123',
        name: 'Gopal Admin Test',
        companyName: 'Gopal Tech Solutions',
        otp: correctOtp // Correct code
      }
    };
    const res3 = mockResponse();
    await registerCompany(req3, res3);

    if (res3.statusCode === 201 || !res3.statusCode) {
      console.log('✅ Registration SUCCEEDED with valid OTP!');
      console.log('   User email verified in DB:', res3.jsonData.isEmailVerified ? 'YES' : 'NO');
    } else {
      console.log('❌ Error: Registration failed with valid OTP!', res3.jsonData);
    }

    // Generate another OTP for passwordless login
    console.log('\n--- Test 4: Request login OTP ---');
    const req4 = {
      body: {
        email: 'testotp@example.com',
        mode: 'login'
      }
    };
    const res4 = mockResponse();
    await sendOTP(req4, res4);
    
    const dbOtpRecord2 = await OTP.findOne({ email: 'testotp@example.com' });
    const loginOtp = dbOtpRecord2.otp;
    console.log(`🔑 Retrieved Login OTP from DB: ${loginOtp}`);

    console.log('\n--- Test 5: Passwordless Login with VALID OTP ---');
    const req5 = {
      body: {
        email: 'testotp@example.com',
        otp: loginOtp
      }
    };
    const res5 = mockResponse();
    await loginWithOTP(req5, res5);

    if (res5.jsonData && res5.jsonData.token) {
      console.log('✅ Passwordless Login SUCCEEDED!');
      console.log(`   Session JWT generated: ${res5.jsonData.token.substring(0, 20)}...`);
    } else {
      console.log('❌ Error: Passwordless login failed!', res5.jsonData);
    }

    console.log('\n--- Clean up test data ---');
    const cleanupUsers = await User.find({ email: 'testotp@example.com' });
    for (const u of cleanupUsers) {
      if (u.companyId) await Company.findByIdAndDelete(u.companyId);
      await User.findByIdAndDelete(u._id);
    }
    await OTP.deleteMany({ email: 'testotp@example.com' });
    console.log('✅ Clean up complete.');

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Test script execution crashed:', error);
    process.exit(1);
  }
};

runTest();
