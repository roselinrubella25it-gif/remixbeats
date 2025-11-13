import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { getAllImages } from '../assets/assets.js';
import { useAuth } from '../context/AuthContext';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addToCart, cartCount, favorites, addToFavorites, removeFromFavorites } = useAuth();

  const categories = [
    { id: 'all', name: 'All Products', icon: 'fas fa-th-large' },
    { id: 'headphones', name: 'Headphones', icon: 'fas fa-headphones' },
    { id: 'earbuds', name: 'Earbuds', icon: 'fas fa-volume-up' },
    { id: 'speakers', name: 'Speakers', icon: 'fas fa-volume-up' },
    { id: 'accessories', name: 'Accessories', icon: 'fas fa-plug' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Try to fetch from API first
        const response = await axios.get('http://localhost:5000/api/images');
        if (response.data && response.data.length > 0) {
          setProducts(response.data);
        } else {
          // Fallback to static assets (filter out admin and logo images)
          const filteredAssets = getAllImages().filter(product =>
            !['admin', 'logo', 'product-showcase'].includes(product.category)
          );
          setProducts(filteredAssets);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to static assets (filter out admin and logo images)
        const filteredAssets = getAllImages().filter(product =>
          !['admin', 'logo', 'product-showcase'].includes(product.category)
        );
        setProducts(filteredAssets);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(cat => cat.id === category);
    return categoryData ? categoryData.icon : 'fas fa-box';
  };

  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'headphones': return 'primary';
      case 'earbuds': return 'success';
      case 'speakers': return 'warning';
      case 'accessories': return 'info';
      case 'hero': return 'secondary';
      case 'product-showcase': return 'dark';
      default: return 'secondary';
    }
  };

  const toggleFavorite = (productId) => {
    if (favorites.has(productId)) {
      removeFromFavorites(productId);
    } else {
      addToFavorites(productId);
    }
  };

  const isFavorite = (productId) => {
    return favorites.has(productId);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center shop-loading">
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <h4>Loading Products...</h4>
          <p className="text-muted">Please wait while we load our amazing Beats collection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-page">
      <div className="page-content">
        {/* Hero Section */}
        <section className="shop-hero">
          <div className="hero-content">
            <h1 className="hero-title">Shop Beats</h1>
            <p className="hero-subtitle">Discover premium sound experiences for every moment</p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">{products.length}</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat">
                <span className="stat-number">{categories.length - 1}</span>
                <span className="stat-label">Categories</span>
              </div>
              <div className="stat">
                <span className="stat-number">∞</span>
                <span className="stat-label">Sound Quality</span>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="category-filter">
          <div className="filter-buttons">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'primary' : 'outline-primary'}
                className="filter-btn"
                onClick={() => setSelectedCategory(category.id)}
              >
                <i className={`${category.icon} me-2`}></i>
                {category.name}
                {selectedCategory === category.id && (
                  <Badge bg="light" text="dark" className="ms-2">
                    {filteredProducts.length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </section>

        {/* Products Grid */}
        <section className="products-section">
          <div className="section-header">
            <h2 className="section-title">
              {selectedCategory === 'all' ? 'All Products' : `${categories.find(cat => cat.id === selectedCategory)?.name}`}
              <Badge bg="primary" className="ms-2">{filteredProducts.length} items</Badge>
            </h2>
          </div>

          {filteredProducts.length > 0 ? (
            <Row className="products-grid">
              {filteredProducts.map((product) => (
                <Col key={product._id || product.id} xl={3} lg={4} md={6} sm={6} xs={12} className="mb-4">
                  <Card className="product-card">
                    <div className="product-image-container">
                      <Card.Img
                        variant="top"
                        src={product.imageUrl}
                        alt={product.altText}
                        className="product-image"
                      />
                      <div className="product-overlay">
                        <Button variant="light" className="quick-view-btn">
                          <i className="fas fa-eye"></i>
                        </Button>
                      </div>
                      <Button
                        variant="light"
                        className={`favorite-btn ${isFavorite(product._id || product.id) ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product._id || product.id);
                        }}
                      >
                        <i className={`fas fa-heart ${isFavorite(product._id || product.id) ? 'text-danger' : ''}`}></i>
                      </Button>
                    </div>
                    <Card.Body className="product-body">
                      <div className="product-category">
                        <Badge bg={getCategoryBadgeColor(product.category)} className="category-badge">
                          <i className={`${getCategoryIcon(product.category)} me-1`}></i>
                          {product.category}
                        </Badge>
                      </div>
                      <Card.Title className="product-title">{product.title}</Card.Title>
                      {product.description && (
                        <Card.Text className="product-description">
                          {product.description.length > 80
                            ? `${product.description.substring(0, 80)}...`
                            : product.description
                          }
                        </Card.Text>
                      )}
                      <div className="product-actions">
                        <Button
                          variant="primary"
                          className="add-to-cart-btn"
                          onClick={() => addToCart(product)}
                          title="Add to Cart"
                        >
                          <i className="fas fa-shopping-cart"></i>
                        </Button>
                        <Button
                          variant="outline-primary"
                          className={`wishlist-btn ${isFavorite(product._id || product.id) ? 'active' : ''}`}
                          onClick={() => toggleFavorite(product._id || product.id)}
                          title={isFavorite(product._id || product.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                        >
                          <i className={`fas fa-heart ${isFavorite(product._id || product.id) ? 'text-white' : ''}`}></i>
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="no-products text-center">
              <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
              <h3>No products found</h3>
              <p className="text-muted">Try selecting a different category or check back later.</p>
              <Button
                variant="primary"
                onClick={() => setSelectedCategory('all')}
                disabled={selectedCategory === 'all'}
              >
                View All Products
              </Button>
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section className="shop-cta">
          <div className="cta-content">
            <h3>Experience Premium Sound</h3>
            <p>Join millions of music lovers who choose Beats for their audio experience</p>
            <div className="cta-features">
              <div className="feature">
                <i className="fas fa-shield-alt"></i>
                <span>2-Year Warranty</span>
              </div>
              <div className="feature">
                <i className="fas fa-truck"></i>
                <span>Free Shipping</span>
              </div>
              <div className="feature">
                <i className="fas fa-headset"></i>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Shop;