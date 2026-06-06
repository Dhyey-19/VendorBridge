import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const PortalLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      <Navbar />
      
      <main style={{ flex: '1 0 auto', padding: '40px 0', position: 'relative', zIndex: 1 }}>
        <div className="container">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PortalLayout;
