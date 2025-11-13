import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Accordion, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './Support.css';

const Support = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const supportCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: 'fas fa-play-circle',
      description: 'New to Beats? Learn the basics',
      articles: [
        'How to pair your Beats wireless device',
        'Setting up your Beats account',
        'Understanding your warranty',
        'Basic troubleshooting steps'
      ]
    },
    {
      id: 'audio-quality',
      title: 'Audio & Sound',
      icon: 'fas fa-volume-up',
      description: 'Optimize your listening experience',
      articles: [
        'Adjusting sound settings',
        'Using Spatial Audio',
        'Noise cancellation tips',
        'Customizing EQ settings'
      ]
    },
    {
      id: 'connectivity',
      title: 'Connectivity',
      icon: 'fas fa-wifi',
      description: 'Bluetooth and device connections',
      articles: [
        'Connecting to multiple devices',
        'Fixing Bluetooth connection issues',
        'Resetting your Beats device',
        'Updating firmware'
      ]
    },
    {
      id: 'battery-life',
      title: 'Battery & Charging',
      icon: 'fas fa-battery-full',
      description: 'Maximize battery performance',
      articles: [
        'Extending battery life',
        'Charging best practices',
        'Battery health tips',
        'Fast charging explained'
      ]
    },
    {
      id: 'warranty-repair',
      title: 'Warranty & Repair',
      icon: 'fas fa-tools',
      description: 'Service and repair information',
      articles: [
        'Warranty coverage details',
        'How to start a repair request',
        'Out-of-warranty options',
        'Replacement policies'
      ]
    },
    {
      id: 'compatibility',
      title: 'Device Compatibility',
      icon: 'fas fa-mobile-alt',
      description: 'Works with all your devices',
      articles: [
        'iPhone and iPad compatibility',
        'Android device support',
        'Mac and Windows compatibility',
        'Third-party app integration'
      ]
    }
  ];

  const quickHelp = [
    {
      question: 'How do I reset my Beats device?',
      answer: 'To reset your Beats device, put it in pairing mode and hold the power button for 15 seconds until you see the LED flash. This will clear all paired devices.'
    },
    {
      question: 'Why is my battery draining quickly?',
      answer: 'Battery drain can be caused by high volume levels, active noise cancellation, or leaving Bluetooth on. Try lowering volume, disabling ANC, or turning off Bluetooth when not in use.'
    },
    {
      question: 'How do I update my Beats firmware?',
      answer: 'Firmware updates happen automatically when your device is connected to the Beats app. Make sure you have the latest version of the app installed.'
    },
    {
      question: 'My device won\'t connect to my phone',
      answer: 'Try resetting your device, forgetting the device in your phone\'s Bluetooth settings, and then pairing again. Make sure no other devices are trying to connect.'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
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

      setSubmitStatus({
        type: 'success',
        message: 'Your message has been sent successfully! We\'ll get back to you within 24 hours.'
      });

      // Reset form
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });

    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again or contact us directly.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="support-page">
      {/* Hero Section */}
      <section className="support-hero">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="hero-title">Support Center</h1>
              <p className="hero-subtitle">
                Get help with your Beats products. Find answers, troubleshoot issues,
                or contact our support team.
              </p>
              <div className="hero-features">
                <div className="feature">
                  <i className="fas fa-clock"></i>
                  <span>24/7 Support</span>
                </div>
                <div className="feature">
                  <i className="fas fa-users"></i>
                  <span>Expert Help</span>
                </div>
                <div className="feature">
                  <i className="fas fa-tools"></i>
                  <span>DIY Guides</span>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-image">
                <img src="/src/assets/Headset/Android_black.png" alt="Support" className="img-fluid" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        {/* Quick Help Section */}
        <section className="quick-help mb-5">
          <div className="text-center mb-4">
            <h2 className="section-title">Quick Help</h2>
            <p className="section-subtitle">Find answers to common questions</p>
          </div>

          <Row>
            {quickHelp.map((item, index) => (
              <Col md={6} key={index} className="mb-3">
                <Card className="quick-help-card">
                  <Card.Body>
                    <Card.Title className="quick-question">
                      <i className="fas fa-question-circle me-2 text-primary"></i>
                      {item.question}
                    </Card.Title>
                    <Card.Text className="quick-answer">
                      {item.answer}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Support Categories */}
        <section className="support-categories mb-5">
          <div className="text-center mb-4">
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle">Detailed guides and troubleshooting</p>
          </div>

          <Row>
            {supportCategories.map((category) => (
              <Col lg={4} md={6} key={category.id} className="mb-4">
                <Card className="support-category-card h-100">
                  <Card.Body className="text-center">
                    <div className="category-icon mb-3">
                      <i className={`${category.icon} fa-3x text-primary`}></i>
                    </div>
                    <Card.Title className="category-title">{category.title}</Card.Title>
                    <Card.Text className="category-description mb-3">
                      {category.description}
                    </Card.Text>
                    <div className="category-articles mb-3">
                      <small className="text-muted">
                        <i className="fas fa-file-alt me-1"></i>
                        {category.articles.length} articles
                      </small>
                    </div>
                    <Button variant="outline-primary" className="category-btn">
                      View Articles
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Detailed FAQ */}
        <section className="detailed-faq mb-5">
          <div className="text-center mb-4">
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>

          <Row className="justify-content-center">
            <Col lg={8}>
              <Accordion className="faq-accordion">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <i className="fas fa-shield-alt me-2"></i>
                    What is covered under warranty?
                  </Accordion.Header>
                  <Accordion.Body>
                    Your Beats products come with a 1-year limited warranty covering manufacturing defects.
                    This includes hardware failures, but does not cover damage from misuse, accidents, or normal wear.
                    Warranty service is provided through authorized service centers.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    <i className="fas fa-exchange-alt me-2"></i>
                    How do I return or exchange a product?
                  </Accordion.Header>
                  <Accordion.Body>
                    Returns are accepted within 30 days of purchase with original packaging and proof of purchase.
                    Items must be unused and in resalable condition. Exchanges are processed within 5-7 business days.
                    Return shipping costs may apply unless the item is defective.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                  <Accordion.Header>
                    <i className="fas fa-headset me-2"></i>
                    How do I clean my Beats products?
                  </Accordion.Header>
                  <Accordion.Body>
                    Use a soft, dry cloth to clean the exterior. For earbuds, gently wipe with a damp cloth and dry thoroughly.
                    Avoid using cleaning fluids, solvents, or abrasive materials. Never submerge products in water unless specified as waterproof.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                  <Accordion.Header>
                    <i className="fas fa-battery-half me-2"></i>
                    Why does my battery drain faster than expected?
                  </Accordion.Header>
                  <Accordion.Body>
                    Battery life varies based on usage: high volume levels, active noise cancellation, and leaving Bluetooth enabled when not in use all reduce battery life. Cold temperatures can also impact performance. Try lowering volume and disabling unused features to extend battery life.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="4">
                  <Accordion.Header>
                    <i className="fas fa-mobile-alt me-2"></i>
                    Which devices are compatible with my Beats?
                  </Accordion.Header>
                  <Accordion.Body>
                    Beats products work with any Bluetooth-enabled device. For the best experience, we recommend iPhone with iOS 15+ or Android devices with Android 8+. Full feature support including Spatial Audio is available on Apple devices.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
        </section>

        {/* Contact Support */}
        <section className="contact-support">
          <div className="text-center mb-4">
            <h2 className="section-title">Contact Support</h2>
            <p className="section-subtitle">Can't find what you're looking for? Get in touch with our team</p>
          </div>

          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="contact-card">
                <Card.Body>
                  {submitStatus && (
                    <Alert variant={submitStatus.type === 'success' ? 'success' : 'danger'} className="mb-4">
                      {submitStatus.message}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={contactForm.name}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email *</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={contactForm.email}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        name="category"
                        value={contactForm.category}
                        onChange={handleInputChange}
                      >
                        <option value="general">General Inquiry</option>
                        <option value="technical">Technical Support</option>
                        <option value="warranty">Warranty & Repair</option>
                        <option value="billing">Billing & Orders</option>
                        <option value="feedback">Feedback & Suggestions</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Subject *</Form.Label>
                      <Form.Control
                        type="text"
                        name="subject"
                        value={contactForm.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Message *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="message"
                        value={contactForm.message}
                        onChange={handleInputChange}
                        placeholder="Describe your issue or question in detail..."
                        required
                      />
                    </Form.Group>

                    <div className="text-center">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={loading}
                        className="contact-submit-btn"
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-paper-plane me-2"></i>
                            Send Message
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        {/* Additional Resources */}
        <section className="additional-resources mt-5">
          <div className="text-center mb-4">
            <h3>Additional Resources</h3>
          </div>

          <Row className="justify-content-center">
            <Col md={4} className="mb-3">
              <Card className="resource-card text-center">
                <Card.Body>
                  <i className="fas fa-download fa-2x text-primary mb-3"></i>
                  <Card.Title>Downloads</Card.Title>
                  <Card.Text>Firmware updates and manuals</Card.Text>
                  <Button variant="outline-primary">Download Center</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="resource-card text-center">
                <Card.Body>
                  <i className="fas fa-video fa-2x text-success mb-3"></i>
                  <Card.Title>Video Guides</Card.Title>
                  <Card.Text>Step-by-step visual tutorials</Card.Text>
                  <Button variant="outline-success">Watch Videos</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="resource-card text-center">
                <Card.Body>
                  <i className="fas fa-users fa-2x text-info mb-3"></i>
                  <Card.Title>Community</Card.Title>
                  <Card.Text>Connect with other Beats users</Card.Text>
                  <Button variant="outline-info">Join Community</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
};

export default Support;