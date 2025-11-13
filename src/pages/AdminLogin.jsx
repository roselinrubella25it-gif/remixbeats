import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getLogo } from '../assets/assets.js';
import './AdminLogin.css';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const logo = getLogo();

  useEffect(() => {
    // Clear any existing alerts after 5 seconds
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const result = await login(credentials.username, credentials.password);

      if (result.success) {
        setAlert({ message: 'Login successful! Redirecting...', type: 'success' });
        setTimeout(() => navigate('/admin'), 1500);
      } else {
        setAlert({ message: result.error || 'Invalid credentials. Please try again.', type: 'danger' });
      }
    } catch (error) {
      setAlert({ message: 'Network error. Please check your connection.', type: 'danger' });
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    // Clear alert when user starts typing
    if (alert) setAlert(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-bg">
        <div className="admin-login-overlay"></div>
        <Container className="admin-login">
          <Row className="justify-content-center align-items-center min-vh-100">
            <Col md={8} lg={6} xl={5}>
              <Card className="login-card shadow-lg">
                <Card.Body className="p-5">
                  {/* Logo Section */}
                  <div className="text-center mb-4">
                    <div className="logo-container mb-3">
                      {logo && <img src={logo.imageUrl} alt={logo.altText} className="admin-logo" />}
                    </div>
                    <h1 className="login-title">Admin Portal</h1>
                    <p className="login-subtitle">Beats by Dre Management System</p>
                    <div className="divider mx-auto"></div>
                  </div>

                  {/* Alert */}
                  {alert && (
                    <Alert
                      variant={alert.type}
                      className="mb-4 text-center alert-custom"
                      dismissible
                      onClose={() => setAlert(null)}
                    >
                      <i className={`fas fa-${alert.type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
                      {alert.message}
                    </Alert>
                  )}

                  {/* Login Form */}
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label className="form-label-custom">
                        <i className="fas fa-user me-2"></i>
                        Administrator Username
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        placeholder="Enter your admin username"
                        required
                        size="lg"
                        className="form-control-custom"
                        disabled={loading}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="form-label-custom">
                        <i className="fas fa-lock me-2"></i>
                        Security Password
                      </Form.Label>
                      <div className="password-input-container">
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={credentials.password}
                          onChange={handleChange}
                          placeholder="Enter your secure password"
                          required
                          size="lg"
                          className="form-control-custom password-input"
                          disabled={loading}
                        />
                        <Button
                          variant="link"
                          className="password-toggle"
                          onClick={togglePasswordVisibility}
                          type="button"
                          disabled={loading}
                        >
                          <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                        </Button>
                      </div>
                    </Form.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      size="lg"
                      className="w-100 login-btn-custom"
                      disabled={loading || !credentials.username.trim() || !credentials.password.trim()}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Authenticating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Access Admin Panel
                        </>
                      )}
                    </Button>
                  </Form>

                  {/* Login Credentials Info */}
                  <div className="login-credentials-info">
                    <div className="credentials-card">
                      <h6 className="credentials-title">
                        <i className="fas fa-key me-2"></i>
                        Demo Login Credentials
                      </h6>
                      <div className="credentials-display">
                        <div className="credential-box">
                          <strong>Username:</strong> <code>x</code>
                        </div>
                        <div className="credential-box">
                          <strong>Password:</strong> <code>admin123</code>
                        </div>
                      </div>
                      <div className="mt-3 text-center">
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => {
                            const username = 'x';
                            const password = 'admin123';
                            setCredentials({ username, password });
                            setAlert({ message: 'Credentials filled automatically!', type: 'success' });
                          }}
                          className="auto-fill-btn"
                        >
                          <i className="fas fa-magic me-1"></i>
                          Auto-Fill Credentials
                        </Button>
                      </div>
                      <small className="credentials-note d-block mt-2">
                        <i className="fas fa-lightbulb me-1"></i>
                        Click "Auto-Fill Credentials" and then click "Access Admin Panel"
                      </small>
                    </div>
                  </div>

                  {/* Footer Links */}
                  <div className="text-center mt-4">
                    <div className="login-footer">
                      <Button
                        variant="link"
                        onClick={() => navigate('/')}
                        className="back-to-site-link"
                        disabled={loading}
                      >
                        <i className="fas fa-arrow-left me-1"></i>
                        Return to Main Website
                      </Button>
                      <div className="login-info mt-3">
                        <small className="text-muted">
                          <i className="fas fa-shield-alt me-1"></i>
                          Secure administrative access only
                        </small>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Security Notice */}
              <div className="security-notice text-center mt-3">
                <small className="text-light">
                  <i className="fas fa-lock me-1"></i>
                  This area is restricted to authorized personnel only.
                </small>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AdminLogin;