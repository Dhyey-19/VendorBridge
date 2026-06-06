import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vendor from './models/Vendor.js';

dotenv.config();

const dummyVendors = [
  {
    name: "TechNexus Hardware Solutions",
    category: ["Hardware"],
    gstNumber: "24AAACG1234D1Z5",
    website: "https://technexus-hardware.in",
    address: "102, Silicon Hub, SG Highway",
    city: "Ahmedabad",
    contactPerson: {
      name: "Rahul Sharma",
      phone: "9876543210",
      email: "rahul@technexus.in"
    }
  },
  {
    name: "CloudScale Software",
    category: ["Software", "IT Services"],
    gstNumber: "27AABCU9603R1ZM",
    website: "https://cloudscale.io",
    address: "4th Floor, Tech Park, Magarpatta",
    city: "Pune",
    contactPerson: {
      name: "Priya Desai",
      phone: "9822334455",
      email: "priya.desai@cloudscale.io"
    }
  },
  {
    name: "Rapid Logistics Corp",
    category: ["Logistics & Supply Chain"],
    gstNumber: "24ABCPR4567A2Z9",
    website: "https://rapidlogistics.co.in",
    address: "Plot 45, GIDC Industrial Estate",
    city: "Surat",
    contactPerson: {
      name: "Amit Patel",
      phone: "9988776655",
      email: "amit.patel@rapidlogistics.com"
    }
  },
  {
    name: "Apex Office Supplies",
    category: ["Office Supplies"],
    gstNumber: "07BBPMA8765F1Z2",
    website: "https://apexoffice.com",
    address: "Shop No. 12, Connaught Place",
    city: "New Delhi",
    contactPerson: {
      name: "Vikram Singh",
      phone: "9123456789",
      email: "vikram@apexoffice.com"
    }
  },
  {
    name: "NextGen IT Services",
    category: ["IT Services", "Consulting"],
    gstNumber: "29BBCHJ1111L1Z8",
    website: "https://nextgen-it.in",
    address: "Whitefield Main Road",
    city: "Bengaluru",
    contactPerson: {
      name: "Nita Rao",
      phone: "8899001122",
      email: "nita.rao@nextgen-it.in"
    }
  },
  {
    name: "Precision Manufacturing Pvt Ltd",
    category: ["Manufacturing"],
    gstNumber: "24ABCPM2233N1Z5",
    website: "https://precisionmfg.com",
    address: "Shed No 20, Aji GIDC",
    city: "Rajkot",
    contactPerson: {
      name: "Ketan Chawla",
      phone: "9090808070",
      email: "ketan@precisionmfg.com"
    }
  },
  {
    name: "Elite Marketing & PR",
    category: ["Marketing & PR"],
    gstNumber: "27AABCQ7777E1Z3",
    website: "https://elitemarketing.co",
    address: "Bandra Kurla Complex",
    city: "Mumbai",
    contactPerson: {
      name: "Neha Gupta",
      phone: "9000100020",
      email: "neha.g@elitemarketing.co"
    }
  }
];

const seedVendors = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');
    
    console.log('Inserting dummy vendors...');
    const result = await Vendor.insertMany(dummyVendors);
    console.log(`Successfully inserted ${result.length} vendors!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding vendors:', error);
    process.exit(1);
  }
};

seedVendors();
