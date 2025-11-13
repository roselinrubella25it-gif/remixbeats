import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { getProductImages } from '../assets/assets.js';
import './Home.css';

const Home = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Fetch hero images from API first, fallback to static assets
        const heroResponse = await axios.get('http://localhost:5000/api/images/category/hero');
        if (heroResponse.data && heroResponse.data.length > 0) {
          setHeroImages(heroResponse.data);
        } else {
          // Fallback to static assets
          setHeroImages([{ imageUrl: '/src/assets/Heroimg/heroimg.jpg', altText: 'Beats by Dre Hero' }]);
        }

        // Fetch product images from API first, fallback to static assets
        const headphonesResponse = await axios.get('http://localhost:5000/api/images/category/headphones');
        const earbudsResponse = await axios.get('http://localhost:5000/api/images/category/earbuds');
        const speakersResponse = await axios.get('http://localhost:5000/api/images/category/speakers');

        let allProducts = [
          ...headphonesResponse.data,
          ...earbudsResponse.data,
          ...speakersResponse.data
        ];

        // If no products from API, use static assets
        if (allProducts.length === 0) {
          allProducts = getProductImages();
        }

        setProductImages(allProducts.slice(0, 6)); // Limit to 6 products
      } catch (error) {
        console.error('Error fetching images:', error);
        // Fallback to static assets
        setHeroImages([{ imageUrl: '/src/assets/Heroimg/heroimg.jpg', altText: 'Beats by Dre Hero' }]);
        setProductImages(getProductImages().slice(0, 6));
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section - Full Width */}
      <section className="hero-section" style={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
        <div className="hero-content page-content">
          <h1 className="hero-title">Beats by Dre</h1>
          <p className="hero-subtitle">Premium sound for every moment</p>
          <Button variant="dark" size="lg" className="hero-btn">Shop Now</Button>
        </div>
        {heroImages.length > 0 && (
          <div className="hero-image">
            <img src={heroImages[0].imageUrl} alt={heroImages[0].altText} className="img-fluid" />
          </div>
        )}
      </section>

      {/* Featured Products - Centered */}
      <section className="featured-products">
        <div className="page-content">
          <div className="text-center mb-5">
            <h2 className="section-title">Featured Products</h2>
          </div>
          <Row className="justify-content-center">
            {productImages.slice(0, 6).map((product) => (
              <Col lg={4} md={6} key={product.id || product._id || product.title} className="mb-4 d-flex justify-content-center">
                <Card className="product-card">
                  <Card.Img variant="top" src={product.imageUrl} alt={product.altText} />
                  <Card.Body>
                    <Card.Title>{product.title}</Card.Title>
                    <Button variant="outline-dark">Learn More</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="categories">
        <div className="page-content">
          <div className="text-center mb-5">
            <h2 className="section-title">Shop by Category</h2>
          </div>
          <Row className="justify-content-center">
            <Col lg={3} md={6} key="headphones" className="mb-4 d-flex justify-content-center">
              <Card className="category-card">
                <div className="category-image">
                  <img src="/src/assets/Headset/Android_black.png" alt="Headphones" className="img-fluid" />
                </div>
                <Card.Body className="text-center">
                  <h5>Headphones</h5>
                  <p className="category-description">Premium wireless for studio-quality sound</p>
                  <Button variant="link">Shop Now →</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} key="earbuds" className="mb-4 d-flex justify-content-center">
              <Card className="category-card">
                <div className="category-image">
                  <img src="/src/assets/Earbuds/Bluetooth_wood.jpg" alt="Earbuds" className="img-fluid" />
                </div>
                <Card.Body className="text-center">
                  <h5>Earbuds</h5>
                  <p className="category-description">True wireless earbuds for every lifestyle and activity</p>
                  <Button variant="link">Shop Now →</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} key="speakers" className="mb-4 d-flex justify-content-center">
              <Card className="category-card">
                <div className="category-image">
                  <img src="/src/assets/homepage/bluetooth&heaset.png" alt="Speakers" className="img-fluid" />
                </div>
                <Card.Body className="text-center">
                  <h5>Speakers</h5>
                  <p className="category-description">Portable speakers with powerful sound and deep bass</p>
                  <Button variant="link">Shop Now →</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} key="accessories" className="mb-4 d-flex justify-content-center">
              <Card className="category-card">
                <div className="category-image">
                  <img src="/src/assets/homepage/headset_black.jpg" alt="Accessories" className="img-fluid" />
                </div>
                <Card.Body className="text-center">
                  <h5>Accessories</h5>
                  <p className="category-description">Cables, cases, and essential accessories for your devices</p>
                  <Button variant="link">Shop Now →</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
};

export default Home;