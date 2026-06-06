import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const PortalLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      {/* Glow backgrounds */}
      <div className="glow-blob glow-primary"></div>
      <div className="glow-blob glow-secondary"></div>
      
      <Navbar />
      
      <main style={{ flex: '1 0 auto', padding: '40px 0', position: 'relative', zIndex: 1 }}>
        <div className="container animate-fade-in">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PortalLayout;
