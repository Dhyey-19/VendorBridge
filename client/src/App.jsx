import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PortalLayout from './components/PortalLayout';
import LandingPage from './pages/LandingPage';
import VendorHome from './vendor/pages/Home';
import CompanyHome from './company/pages/Home';

function App() {
  return (
    <Router>
      <PortalLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/vendor" element={<VendorHome />} />
          <Route path="/company" element={<CompanyHome />} />
        </Routes>
      </PortalLayout>
    </Router>
  );
}

export default App;
