import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, ListGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const { cart, cartCount, clearCart } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });
  const [alert, setAlert] = useState(null);

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const total = subtotal + tax + shipping;

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order object
      const orderData = {
        items: cart,
        shipping: formData,
        payment: {
          cardNumber: formData.cardNumber.slice(-4), // Only store last 4 digits
          nameOnCard: formData.nameOnCard
        },
        totals: {
          subtotal: subtotal.toFixed(2),
          tax: tax.toFixed(2),
          shipping: shipping.toFixed(2),
          total: total.toFixed(2)
        },
        orderDate: new Date().toISOString()
      };

      console.log('Order placed:', orderData);

      showAlert('Order placed successfully! Thank you for shopping with Beats by Dre.', 'success');

      // Clear cart and redirect after success
      setTimeout(() => {
        clearCart();
        navigate('/');
      }, 2000);

    } catch (error) {
      showAlert('Failed to place order. Please try again.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="text-center p-5">
              <Card.Body>
                <i className="fas fa-shopping-cart fa-4x text-muted mb-4"></i>
                <h3 className="mb-3">Your cart is empty</h3>
                <p className="text-muted mb-4">Add some products before checkout</p>
                <Button variant="primary" onClick={() => navigate('/shop')}>
                  <i className="fas fa-shopping-bag me-2"></i>
                  Continue Shopping
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4 checkout-page">
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header className="bg-dark text-white">
              <h4 className="mb-0">
                <i className="fas fa-credit-card me-2"></i>
                Checkout
              </h4>
            </Card.Header>
            <Card.Body>
              {alert && (
                <Alert variant={alert.type} className="mb-4">
                  {alert.message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Shipping Information */}
                <div className="mb-4">
                  <h5 className="mb-3">
                    <i className="fas fa-truck me-2"></i>
                    Shipping Information
                  </h5>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone *</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Address *</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address"
                      required
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>City *</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>State *</Form.Label>
                        <Form.Control
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>ZIP Code *</Form.Label>
                        <Form.Control
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Country *</Form.Label>
                        <Form.Select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="USA">United States</option>
                          <option value="CAN">Canada</option>
                          <option value="GBR">United Kingdom</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                {/* Payment Information */}
                <div className="mb-4">
                  <h5 className="mb-3">
                    <i className="fas fa-credit-card me-2"></i>
                    Payment Information
                  </h5>

                  <Form.Group className="mb-3">
                    <Form.Label>Name on Card *</Form.Label>
                    <Form.Control
                      type="text"
                      name="nameOnCard"
                      value={formData.nameOnCard}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Card Number *</Form.Label>
                    <Form.Control
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Expiry Date *</Form.Label>
                        <Form.Control
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>CVV *</Form.Label>
                        <Form.Control
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-lock me-2"></i>
                      Place Order - ${total.toFixed(2)}
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Order Summary */}
          <Card className="mb-4">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <i className="fas fa-receipt me-2"></i>
                Order Summary
              </h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {cart.map((item) => (
                  <ListGroup.Item key={item.id} className="d-flex align-items-center px-0 py-3">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="me-3 rounded"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{item.title}</h6>
                      <small className="text-muted">Qty: {item.quantity}</small>
                    </div>
                    <div className="text-end">
                      <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-0">
                <strong className="h5">Total:</strong>
                <strong className="h5 text-primary">${total.toFixed(2)}</strong>
              </div>

              {shipping === 0 && (
                <div className="mt-2">
                  <Badge bg="success" className="w-100">
                    <i className="fas fa-truck me-1"></i>
                    Free Shipping Applied!
                  </Badge>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Security Badge */}
          <Card>
            <Card.Body className="text-center">
              <i className="fas fa-shield-alt fa-2x text-success mb-2"></i>
              <h6 className="mb-1">Secure Checkout</h6>
              <small className="text-muted">
                Your payment information is encrypted and secure
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;