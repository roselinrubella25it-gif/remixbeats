import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { getLogo } from '../assets/assets.js';
import './Footer.css';

const Footer = () => {
  const logo = getLogo();

  return (
    <footer className="beats-footer">
      <div className="page-content">
        <Row className="footer-main">
          <Col lg={3} md={6} className="footer-section">
            <div className="footer-logo">
              {logo && <img src={logo.imageUrl} alt={logo.altText} className="footer-logo-img" />}
              <h5 className="footer-brand">Beats by Dre</h5>
            </div>
            <p className="footer-description">
              Premium sound for every moment. Experience music like never before with our cutting-edge audio technology.
            </p>
          </Col>

          <Col lg={3} md={6} className="footer-section">
            <h6 className="footer-heading">Products</h6>
            <ul className="footer-links">
              <li><a href="#headphones">Headphones</a></li>
              <li><a href="#earbuds">Earbuds</a></li>
              <li><a href="#speakers">Speakers</a></li>
              <li><a href="#accessories">Accessories</a></li>
            </ul>
          </Col>

          <Col lg={3} md={6} className="footer-section">
            <h6 className="footer-heading">Support</h6>
            <ul className="footer-links">
              <li><a href="#help">Help Center</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#warranty">Warranty</a></li>
              <li><a href="#returns">Returns</a></li>
            </ul>
          </Col>

          <Col lg={3} md={6} className="footer-section">
            <h6 className="footer-heading">Company</h6>
            <ul className="footer-links">
              <li><a href="#about">About Beats</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#press">Press</a></li>
              <li><a href="#legal">Legal</a></li>
            </ul>
          </Col>
        </Row>

        <Row className="footer-bottom">
          <Col md={6}>
            <p className="copyright">
              © 2025 Beats by Dre. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <div className="social-links">
              <a href="#facebook" className="social-link">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#twitter" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#instagram" className="social-link">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#youtube" className="social-link">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </Col>
        </Row>
      </div>
    </footer>
  );
};

export default Footer;