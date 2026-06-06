# VendorBridge ERP

VendorBridge is a comprehensive Procurement and Vendor Management ERP system designed to streamline the Request for Quotation (RFQ) lifecycle. Built with the robust MERN stack (MongoDB, Express.js, React, Node.js), VendorBridge enables organizations to seamlessly manage vendors, solicit structured quotations, automatically evaluate bids, issue Purchase Orders (POs), and process Invoices from a single centralized dashboard.

## 🚀 Key Features

*   **Centralized Dashboard:** Monitor actionable metrics such as active RFQs, pending approvals, and total spend instantly.
*   **Automated RFQ Lifecycle:** Create RFQs and assign them selectively to registered vendors or broadcast them publicly.
*   **Smart Vendor Portal:** Vendors receive a dedicated workspace to view assigned RFQs, track deadlines, and submit competitive bids securely.
*   **Quotation Evaluation:** Procurement officers can review side-by-side bid comparisons, highlighting the most cost-effective submissions.
*   **One-Click PO & Invoice Generation:** Transform accepted quotations directly into official Purchase Orders and allow vendors to submit Invoices against them.
*   **System-Wide Activity Logging:** An integrated audit trail tracking all state transitions for compliance and transparency.

## 🛠️ Technology Stack

*   **Frontend:** React (Vite), React Router, Context API, Lucide Icons, Pure CSS (Glassmorphism & Card-based UI)
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB via Mongoose (NoSQL)
*   **Security:** JSON Web Tokens (JWT), bcryptjs for password hashing

## ⚙️ Local Setup Instructions

Follow these steps to configure and run VendorBridge on your local machine.

### Prerequisites
*   Node.js (v16.x or higher)
*   MongoDB (Local instance or MongoDB Atlas cluster)

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/dhyey-19/vendorbridge.git
cd vendorbridge
\`\`\`

### 2. Environment Configuration
Navigate to the `server` directory and create a `.env` file:
\`\`\`env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
\`\`\`

### 3. Install Dependencies
Open two separate terminal windows/tabs.

**Terminal 1: Server**
\`\`\`bash
cd server
npm install
\`\`\`

**Terminal 2: Client**
\`\`\`bash
cd client
npm install
\`\`\`

### 4. Database Seeding (Optional but Recommended)
To populate the database with realistic structural data, vendors, and an admin user, run the seed script:
\`\`\`bash
cd server
npm run seed
\`\`\`

### 5. Start the Application
Start the backend server and the frontend development server.

**Terminal 1: Server**
\`\`\`bash
cd server
npm run dev
\`\`\`

**Terminal 2: Client**
\`\`\`bash
cd client
npm run dev
\`\`\`
The application will be accessible at `http://localhost:5173`.

---

## 🔑 Demo Credentials

If you have executed the database seeding script (`npm run seed`), you can immediately access the portal using the following pre-configured credentials:

### Administrator
*   **Email:** `admin@globalprocure.com`
*   **Password:** `Password123!`

### Vendor
*   **Email:** `dhyeyshah009@gmail.com`
*   **Password:** `000000`

---
*Designed & Developed by Dhyey Shah.*
