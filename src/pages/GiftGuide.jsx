import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import './GiftGuide.css';

const GiftGuide = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const priceRanges = [
    { id: 'all', label: 'All Prices', min: 0, max: Infinity },
    { id: 'budget', label: 'Under $100', min: 0, max: 100 },
    { id: 'mid', label: '$100 - $200', min: 100, max: 200 },
    { id: 'premium', label: '$200 - $350', min: 200, max: 350 },
    { id: 'luxury', label: 'Over $350', min: 350, max: Infinity }
  ];

  const giftCategories = [
    { id: 'all', name: 'All Gifts', icon: 'fas fa-gift' },
    { id: 'headphones', name: 'Wireless Headphones', icon: 'fas fa-headphones', description: 'Premium sound for music lovers' },
    { id: 'earbuds', name: 'True Wireless Earbuds', icon: 'fas fa-volume-up', description: 'Freedom in every step' },
    { id: 'speakers', name: 'Portable Speakers', icon: 'fas fa-volume-up', description: 'Sound that moves with you' },
    { id: 'accessories', name: 'Premium Accessories', icon: 'fas fa-plug', description: 'Complete your setup' }
  ];

  useEffect(() => {
    fetchGiftProducts();
  }, []);

  const fetchGiftProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/images');
      // Filter out admin-only categories and get gift-appropriate products
      const giftProducts = response.data.filter(product =>
        ['headphones', 'earbuds', 'speakers', 'accessories'].includes(product.category) &&
        product.isActive
      );
      setProducts(giftProducts);
    } catch (error) {
      console.error('Error fetching gift products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesPrice = selectedPriceRange === 'all' || (
      product.price >= priceRanges.find(r => r.id === selectedPriceRange).min &&
      product.price < priceRanges.find(r => r.id === selectedPriceRange).max
    );

    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

    const matchesSearch = searchQuery === '' ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesPrice && matchesCategory && matchesSearch;
  });

  const getGiftRecommendation = (product) => {
    if (product.price < 100) return { label: 'Great Value', color: 'success' };
    if (product.price < 200) return { label: 'Popular Choice', color: 'primary' };
    if (product.price < 350) return { label: 'Premium Gift', color: 'warning' };
    return { label: 'Luxury Gift', color: 'danger' };
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading gift guide...</p>
      </Container>
    );
  }

  return (
    <div className="gift-guide-page">
      <div className="gift-guide-hero">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="hero-title">Gift Guide</h1>
              <p className="hero-subtitle">Find the perfect Beats gift for your loved ones</p>
              <div className="hero-features">
                <div className="feature">
                  <i className="fas fa-shipping-fast"></i>
                  <span>Free Shipping</span>
                </div>
                <div className="feature">
                  <i className="fas fa-undo"></i>
                  <span>Easy Returns</span>
                </div>
                <div className="feature">
                  <i className="fas fa-shield-alt"></i>
                  <span>2 Year Warranty</span>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-image">
                <img src="/src/assets/homepage/gift.jpg" alt="Gift Guide" className="img-fluid" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        {/* Search and Filters */}
        <div className="filters-section mb-5">
          <Row className="justify-content-center">
            <Col lg={8}>
              <InputGroup className="mb-4">
                <InputGroup.Text>
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search gifts by name, brand, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>

          {/* Price Range Filter */}
          <div className="filter-group mb-4">
            <h5 className="filter-title">Price Range</h5>
            <div className="price-buttons">
              {priceRanges.map(range => (
                <Button
                  key={range.id}
                  variant={selectedPriceRange === range.id ? 'primary' : 'outline-primary'}
                  onClick={() => setSelectedPriceRange(range.id)}
                  className="price-btn"
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <h5 className="filter-title">Gift Categories</h5>
            <Row>
              {giftCategories.map(category => (
                <Col md={6} lg={3} key={category.id} className="mb-3">
                  <Card
                    className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <Card.Body className="text-center">
                      <i className={`${category.icon} fa-2x mb-2`}></i>
                      <h6>{category.name}</h6>
                      {category.description && (
                        <small className="text-muted">{category.description}</small>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* Results Header */}
        <div className="results-header mb-4">
          <h3>
            {filteredProducts.length} Perfect Gift{filteredProducts.length !== 1 ? 's' : ''} Found
          </h3>
          {searchQuery && (
            <p className="text-muted">Showing results for "{searchQuery}"</p>
          )}
        </div>

        {/* Gift Products Grid */}
        {filteredProducts.length > 0 ? (
          <Row>
            {filteredProducts.map((product) => {
              const recommendation = getGiftRecommendation(product);
              return (
                <Col key={product._id} xl={3} lg={4} md={6} className="mb-4">
                  <Card className="gift-card h-100">
                    <div className="card-image-container">
                      <Card.Img
                        variant="top"
                        src={product.imageUrl.startsWith('/uploads/') ? `http://localhost:5000${product.imageUrl}` : product.imageUrl}
                        alt={product.title}
                        className="gift-image"
                      />
                      <div className="gift-overlay">
                        <Badge bg={recommendation.color} className="recommendation-badge">
                          {recommendation.label}
                        </Badge>
                      </div>
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <div className="mb-2">
                        <Badge bg="secondary" className="category-badge">
                          <i className={`fas fa-${product.category === 'headphones' ? 'headphones' : product.category === 'earbuds' ? 'volume-up' : product.category === 'speakers' ? 'volume-up' : 'plug'} me-1`}></i>
                          {product.category}
                        </Badge>
                      </div>
                      <Card.Title className="gift-title">{product.title}</Card.Title>
                      <Card.Text className="gift-description flex-grow-1">
                        {product.description ? (
                          product.description.length > 100
                            ? `${product.description.substring(0, 100)}...`
                            : product.description
                        ) : (
                          `Premium ${product.category} from ${product.brand}`
                        )}
                      </Card.Text>
                      <div className="gift-price mb-3">
                        <strong className="price-amount">${product.price}</strong>
                        {product.stock && product.stock > 0 && (
                          <small className="text-success ms-2">
                            <i className="fas fa-check-circle"></i> In Stock
                          </small>
                        )}
                      </div>
                      <Button
                        variant="primary"
                        className="w-100 gift-btn"
                        onClick={() => {
                          // Add to cart functionality would go here
                          alert(`Added ${product.title} to cart!`);
                        }}
                      >
                        <i className="fas fa-gift me-2"></i>
                        Add to Cart
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        ) : (
          <div className="text-center py-5">
            <i className="fas fa-search fa-3x text-muted mb-3"></i>
            <h4>No gifts found</h4>
            <p className="text-muted">Try adjusting your filters or search terms</p>
            <Button
              variant="primary"
              onClick={() => {
                setSelectedPriceRange('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Gift Guide Tips */}
        <div className="gift-tips mt-5">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h4 className="text-center mb-4">
                <i className="fas fa-lightbulb text-warning me-2"></i>
                Gift Guide Tips
              </h4>
              <Row>
                <Col md={4} className="text-center mb-3">
                  <i className="fas fa-music fa-2x text-primary mb-2"></i>
                  <h6>Know Their Taste</h6>
                  <p className="small">Consider their music preferences and lifestyle</p>
                </Col>
                <Col md={4} className="text-center mb-3">
                  <i className="fas fa-battery-full fa-2x text-success mb-2"></i>
                  <h6>Check Specifications</h6>
                  <p className="small">Battery life and features matter for active users</p>
                </Col>
                <Col md={4} className="text-center mb-3">
                  <i className="fas fa-tags fa-2x text-info mb-2"></i>
                  <h6>Set Your Budget</h6>
                  <p className="small">Choose from our wide range of price options</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default GiftGuide;