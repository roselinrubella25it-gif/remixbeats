import React from 'react';
import { Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';

const Layout = ({ children, className = "" }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="layout">
      <div style={{ position: 'relative' }}>
        {!isAdminRoute && <Navbar />}
        <main className={`main-content ${className}`}>
          {children}
        </main>
      </div>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default Layout;