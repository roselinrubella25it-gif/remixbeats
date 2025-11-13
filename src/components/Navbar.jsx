import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Form, Button, Badge, Offcanvas, ListGroup, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getLogo } from '../assets/assets.js';
import { useAuth } from '../context/AuthContext';
import { assets } from '../assets/assets.js';
import './Navbar.css';

const NavigationBar = () => {
  const logo = getLogo();
  const navigate = useNavigate();
  const { cart, cartCount, removeFromCart, updateQuantity, favorites, addToCart, removeFromFavorites } = useAuth();
  const [showCart, setShowCart] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(favorites.size);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Fetch favorite products from database
  const fetchFavoriteProducts = async () => {
    if (favorites.size === 0) return;

    setLoading(true);
    try {
      const favoriteIds = Array.from(favorites);
      const response = await fetch(`http://localhost:5000/api/images/favorites?ids=${favoriteIds.join(',')}`);
      if (response.ok) {
        const products = await response.json();
        setFavoriteProducts(products);
      }
    } catch (error) {
      console.error('Error fetching favorite products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFavoritesCount(favorites.size);
  }, [favorites]);

  // Listen for favorites updates
  useEffect(() => {
    const handleFavoritesUpdate = (event) => {
      setFavoritesCount(event.detail.count);
    };

    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);

    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, []);

  useEffect(() => {
    if (showFavorites) {
      fetchFavoriteProducts();
    }
  }, [showFavorites, favorites]);

  // Search functionality
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      console.log('Searching for:', query);
      const response = await fetch(`http://localhost:5000/api/images?search=${encodeURIComponent(query)}`);
      console.log('Search response status:', response.status);
      if (response.ok) {
        const results = await response.json();
        console.log('Search results:', results);
        setSearchResults(results || []);
      } else {
        console.error('Search failed with status:', response.status);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 150); // Reduced debounce time for faster response

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="beats-navbar">
        <div className="page-content navbar-content">
          <LinkContainer to="/">
            <Navbar.Brand className="beats-logo">
              {logo && <img src={logo.imageUrl} alt={logo.altText} className="logo-img" />}
              <span className="brand-text">Beats by Dre</span>
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
            <Nav className="nav-links">
              <LinkContainer to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/shop">
                <Nav.Link>Shop</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/gift-guide">
                <Nav.Link>Gift Guide</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/support">
                <Nav.Link>Support</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>

          <Button
            variant="outline-light"
            className="search-btn"
            onClick={() => setShowSearch(!showSearch)}
          >
            <i className="fas fa-search"></i>
          </Button>

          <Button
            variant="outline-light"
            className="favorites-btn"
            onClick={() => setShowFavorites(true)}
          >
            <i className="fas fa-heart"></i>
            {favoritesCount > 0 && (
              <Badge bg="danger" className="favorites-badge">
                {favoritesCount}
              </Badge>
            )}
          </Button>

          <Button
            variant="outline-light"
            className="cart-btn"
            onClick={() => setShowCart(true)}
          >
            <i className="fas fa-shopping-cart"></i>
            {cartCount > 0 && (
              <Badge bg="danger" className="cart-badge">
                {cartCount}
              </Badge>
            )}
          </Button>
        </div>
      </Navbar>

      {/* Cart Offcanvas */}
   <Offcanvas show={showCart} onHide={() => setShowCart(false)} placement="end" style={{ width: '100vw' }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <i className="fas fa-shopping-cart me-2"></i>
          Shopping Cart ({cartCount})
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column">
        {cart.length === 0 ? (
          <div className="text-center py-5 flex-grow-1 d-flex flex-column justify-content-center">
            <i className="fas fa-shopping-cart fa-4x text-muted mb-4"></i>
            <h4 className="text-muted mb-3">Your cart is empty</h4>
            <p className="text-muted mb-4">Add some amazing Beats products to get started!</p>
            <Button variant="primary" onClick={() => setShowCart(false)}>
              <i className="fas fa-shopping-bag me-2"></i>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <small className="text-muted">
                <i className="fas fa-shopping-cart me-1"></i>
                {cartCount} item{cartCount !== 1 ? 's' : ''} in cart
              </small>
            </div>

            <div className="flex-grow-1 overflow-auto">
              <ListGroup variant="flush">
                {cart.map((item) => (
                  <ListGroup.Item key={item.id} className="d-flex align-items-start p-3 mb-2 border rounded">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="cart-item-image me-3 rounded"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-bold">{item.title}</h6>
                      <p className="text-primary fw-bold mb-2">${item.price}</p>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            className="px-2"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <i className="fas fa-minus"></i>
                          </Button>
                          <span className="mx-3 fw-bold">Qty: {item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            className="px-2"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <i className="fas fa-plus"></i>
                          </Button>
                        </div>
                        <small className="text-muted">
                          Subtotal: ${(item.price * item.quantity).toFixed(2)}
                        </small>
                      </div>
                    </div>
                    <Button
                      variant="link"
                      className="text-danger p-0 ms-2"
                      onClick={() => removeFromCart(item.id)}
                      title="Remove from cart"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>

            <div className="border-top pt-3 mt-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="mb-1">Total: <span className="text-primary">${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span></h5>
                  <small className="text-muted">Taxes and shipping calculated at checkout</small>
                </div>
              </div>

              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="py-3"
                  onClick={() => {
                    setShowCart(false);
                    navigate('/checkout');
                  }}
                >
                  <i className="fas fa-credit-card me-2"></i>
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outline-secondary"
                  onClick={() => setShowCart(false)}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Continue Shopping
                </Button>
              </div>

              <div className="text-center mt-3">
                <small className="text-muted">
                  <i className="fas fa-shield-alt me-1"></i>
                  Secure checkout powered by SSL encryption
                </small>
              </div>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>

    {/* Search Offcanvas */}
    <Offcanvas show={showSearch} onHide={() => { setShowSearch(false); setSearchQuery(''); setSearchResults([]); }} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <i className="fas fa-search me-2"></i>
          Product Search
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="search-container">
          <Form.Control
            type="text"
            placeholder="Search products by name, brand, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-3 search-input"
            autoFocus
            style={{ backgroundColor: '#f8f9fa', border: '2px solid #dee2e6' }}
          />
          {searchQuery && (
            <div className="mb-3">
              <small className="text-muted">
                <i className="fas fa-info-circle me-1"></i>
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </small>
            </div>
          )}

          <div className="search-results" style={{ backgroundColor: '#ffffff', minHeight: '70vh', padding: '1rem', overflowY: 'auto' }}>
            {searchQuery && searchResults.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                <h5>No products found</h5>
                <p className="text-muted">Try different keywords like "Beats", "Wireless", or "Black"</p>
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              searchResults.map((product) => (
                <Card key={product._id || product.id} className="mb-3" style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}>
                  <Card.Body className="d-flex align-items-center">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="me-3 rounded"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = '/src/assets/logo/logo.png'; }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{product.title}</h6>
                      <p className="text-primary fw-bold mb-1">${product.price || '299'}</p>
                      <div className="d-flex gap-2 mb-1">
                        <Badge bg="secondary">{product.category}</Badge>
                        {product.color && <Badge bg="info">{product.color}</Badge>}
                      </div>
                      {product.brand && (
                        <small className="text-muted">Brand: {product.brand}</small>
                      )}
                    </div>
                    <div className="d-flex flex-column gap-1">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          addToCart(product);
                          setShowSearch(false);
                        }}
                        title="Add to Cart"
                      >
                        <i className="fas fa-cart-plus"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          addToFavorites(product._id || product.id);
                          setShowSearch(false);
                        }}
                        title="Add to Favorites"
                      >
                        <i className="fas fa-heart"></i>
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))
            ) : searchQuery ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Searching...</span>
                </div>
                <p className="text-muted mt-2">Searching products...</p>
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                <h5>Start typing to search</h5>
                <p className="text-muted">Search by product name, brand, or category</p>
              </div>
            )}
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>

    {/* Favorites Offcanvas */}
    <Offcanvas show={showFavorites} onHide={() => setShowFavorites(false)} placement="end" style={{ width: '100vw' }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <i className="fas fa-heart me-2 text-danger"></i>
          Favorites ({favoritesCount})
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {favorites.size === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-heart fa-3x text-muted mb-3"></i>
            <h4>No favorites yet</h4>
            <p className="text-muted">Heart products you love to save them here!</p>
          </div>
        ) : loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mt-2">Loading favorites...</p>
          </div>
        ) : (
          <div>
            <div className="mb-3">
              <small className="text-muted">
                <i className="fas fa-info-circle me-1"></i>
                {favorites.size} item{favorites.size !== 1 ? 's' : ''} in favorites
              </small>
            </div>
            <ListGroup variant="flush">
              {favoriteProducts.map((product) => (
                <ListGroup.Item key={product._id} className="d-flex align-items-start p-3">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="cart-item-image me-3 rounded"
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-1 fw-bold">{product.title}</h6>
                    <p className="text-primary fw-bold mb-1">${product.price}</p>
                    <div className="mb-2">
                      <Badge bg="secondary" className="me-1">{product.category}</Badge>
                      {product.color && <Badge bg="info">{product.color}</Badge>}
                    </div>
                    {product.brand && (
                      <small className="text-muted d-block mb-1">
                        <i className="fas fa-tag me-1"></i>{product.brand}
                      </small>
                    )}
                    {product.specifications && (
                      <small className="text-muted d-block mb-2">
                        <i className="fas fa-cogs me-1"></i>
                        {product.specifications.length > 50
                          ? `${product.specifications.substring(0, 50)}...`
                          : product.specifications
                        }
                      </small>
                    )}
                    {product.stock && (
                      <small className="text-success d-block">
                        <i className="fas fa-check-circle me-1"></i>
                        {product.stock} in stock
                      </small>
                    )}
                  </div>
                  <div className="d-flex flex-column gap-1">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => {
                        addToCart(product);
                        setShowFavorites(false);
                      }}
                      title="Add to Cart"
                    >
                      <i className="fas fa-cart-plus"></i>
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        removeFromFavorites(product._id);
                        setShowFavorites(false);
                        setTimeout(() => setShowFavorites(true), 100);
                      }}
                      title="Remove from Favorites"
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
            {favoriteProducts.length > 0 && (
              <div className="border-top pt-3 mt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Total Value:</span>
                  <strong className="text-primary">
                    ${favoriteProducts.reduce((total, product) => total + (product.price || 0), 0).toFixed(2)}
                  </strong>
                </div>
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={() => {
                    favoriteProducts.forEach(product => addToCart(product));
                    setShowFavorites(false);
                  }}
                >
                  <i className="fas fa-cart-plus me-2"></i>
                  Add All to Cart
                </Button>
              </div>
            )}
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
    </>
  );
};

export default NavigationBar;