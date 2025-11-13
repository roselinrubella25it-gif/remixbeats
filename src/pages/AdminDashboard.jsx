import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Tabs, Tab, Table, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { assets } from '../assets/assets.js';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([
    'headphones', 'earbuds', 'speakers', 'accessories', 'hero', 'product-showcase'
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('categories');
  const [selectedItems, setSelectedItems] = useState([]);
  const [duplicates, setDuplicates] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'headphones',
    altText: '',
    order: 0,
    isActive: true,
    price: 0,
    brand: 'Beats by Dre',
    color: '',
    specifications: '',
    stock: 0,
    weight: '',
    dimensions: '',
    warranty: '',
    tags: []
  });

  useEffect(() => {
    fetchImages();
    findDuplicates();
  }, [images]);

  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/images');
      setImages(response.data);
    } catch (error) {
      showAlert('Error fetching images', 'danger');
    }
  };


  const findDuplicates = () => {
    const seen = new Map();
    const duplicateGroups = [];

    images.forEach((image) => {
      const key = `${image.title}-${image.category}-${image.imageUrl}`;
      if (seen.has(key)) {
        if (!seen.get(key).isDuplicate) {
          seen.get(key).isDuplicate = true;
          duplicateGroups.push([seen.get(key).image, image]);
        } else {
          const group = duplicateGroups.find(group => group[0] === seen.get(key).image);
          if (group) {
            group.push(image);
          }
        }
      } else {
        seen.set(key, { image, isDuplicate: false });
      }
    });

    setDuplicates(duplicateGroups);
  };

  const handleSelectItem = (id, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(item => item !== id));
    }
  };

  const handleSelectAll = (categoryImages, checked) => {
    if (checked) {
      const newSelected = [...selectedItems];
      categoryImages.forEach(img => {
        if (!newSelected.includes(img._id)) {
          newSelected.push(img._id);
        }
      });
      setSelectedItems(newSelected);
    } else {
      const categoryIds = categoryImages.map(img => img._id);
      setSelectedItems(selectedItems.filter(id => !categoryIds.includes(id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      showAlert('No items selected for deletion', 'warning');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) return;

    try {
      for (const id of selectedItems) {
        await axios.delete(`http://localhost:5000/api/images/${id}`);
      }
      showAlert('Selected items deleted successfully');
      setSelectedItems([]);
      fetchImages();
    } catch (error) {
      showAlert('Error deleting items', 'danger');
    }
  };

  const handleDeleteDuplicate = async (duplicateId) => {
    try {
      await axios.delete(`http://localhost:5000/api/images/${duplicateId}`);
      showAlert('Duplicate deleted successfully');
      fetchImages();
    } catch (error) {
      showAlert('Error deleting duplicate', 'danger');
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingImage) {
        await axios.put(`http://localhost:5000/api/images/${editingImage._id}`, formData);
        showAlert('Image updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/images', formData);
        showAlert('Image added successfully');
      }

      fetchImages();
      handleCloseModal();
    } catch (error) {
      showAlert(error.response?.data?.message || 'Error saving image', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/images/${id}`);
      showAlert('Image deleted successfully');
      fetchImages();
    } catch (error) {
      showAlert('Error deleting image', 'danger');
    }
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      description: image.description || '',
      imageUrl: image.imageUrl,
      category: image.category,
      altText: image.altText || '',
      order: image.order,
      isActive: image.isActive,
      price: image.price || 0,
      brand: image.brand || 'Beats by Dre',
      color: image.color || '',
      specifications: image.specifications || '',
      stock: image.stock || 0,
      weight: image.weight || '',
      dimensions: image.dimensions || '',
      warranty: image.warranty || '',
      tags: image.tags || []
    });
    // For editing, we don't require a new file upload
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingImage(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      category: 'headphones',
      altText: '',
      order: 0,
      isActive: true,
      price: 0,
      brand: 'Beats by Dre',
      color: '',
      specifications: '',
      stock: 0,
      weight: '',
      dimensions: '',
      warranty: '',
      tags: []
    });
  };

  const getImagesByCategory = (category) => {
    return images.filter(img => img.category === category);
  };

  return (
    <div className="admin-dashboard-page">
      <Container fluid className="admin-dashboard" style={{ paddingTop: '0' }}>
        <div className="admin-dashboard-header">
          <div className="text-center w-100">
            <h1 className="mb-2">Admin Dashboard</h1>
            <p className="subtitle mb-3">Manage your Beats by Dre product catalog efficiently</p>
            <div className="stats-row justify-content-center">
              <div className="stat-card">
                <h4>{images.length}</h4>
                <p>Total Products</p>
              </div>
              <div className="stat-card">
                <h4>{categories.length}</h4>
                <p>Categories</p>
              </div>
              <div className="stat-card">
                <h4>{duplicates.length}</h4>
                <p>Duplicate Groups</p>
              </div>
            </div>
            <div className="mt-3">
              <Button variant="outline-light" onClick={() => setShowModal(true)} className="me-2">
                <i className="fas fa-plus me-2"></i>Add Product
              </Button>
              <Button variant="outline-danger" onClick={logout}>
                <i className="fas fa-sign-out-alt me-2"></i>Logout
              </Button>
            </div>
          </div>
        </div>

      {alert && (
        <Row className="mb-3">
          <Col>
            <Alert variant={alert.type}>{alert.message}</Alert>
          </Col>
        </Row>
      )}


      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        <Tab eventKey="categories" title="Categories">
          <Card>
            <Card.Body>
              <h4>Select a Category</h4>
              <Row>
                {categories.map((category) => (
                  <Col md={4} key={category} className="mb-3">
                    <Card
                      className="category-card"
                      onClick={() => setActiveTab(category)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Card.Body>
                        <h5>{category.charAt(0).toUpperCase() + category.slice(1)}</h5>
                        <p>{getImagesByCategory(category).length} images</p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="duplicates" title={`Duplicates (${duplicates.length})`}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Duplicate Products</h4>
                {selectedItems.length > 0 && (
                  <Button variant="danger" onClick={handleBulkDelete}>
                    Delete Selected ({selectedItems.length})
                  </Button>
                )}
              </div>
              {duplicates.length === 0 ? (
                <p className="text-muted">No duplicate products found.</p>
              ) : (
                duplicates.map((group, index) => (
                  <Card key={index} className="mb-3">
                    <Card.Body>
                      <h6>Duplicate Group {index + 1}</h6>
                      <Table size="sm">
                        <thead>
                          <tr>
                            <th>Select</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.map((dup) => (
                            <tr key={dup._id}>
                              <td>
                                <Form.Check
                                  checked={selectedItems.includes(dup._id)}
                                  onChange={(e) => handleSelectItem(dup._id, e.target.checked)}
                                />
                              </td>
                              <td>{dup.title}</td>
                              <td>{dup.category}</td>
                              <td>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleDeleteDuplicate(dup._id)}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Card.Body>
          </Card>
        </Tab>

        {categories.map((category) => (
          <Tab eventKey={category} title={category.charAt(0).toUpperCase() + category.slice(1)} key={category}>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4>{category.charAt(0).toUpperCase() + category.slice(1)} Images</h4>
                  <div>
                    {selectedItems.length > 0 && (
                      <Button variant="danger" onClick={handleBulkDelete} className="me-2">
                        Delete Selected ({selectedItems.length})
                      </Button>
                    )}
                    <Button variant="outline-secondary" onClick={() => setActiveTab('categories')}>
                      Back to Categories
                    </Button>
                  </div>
                </div>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Select All</th>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Order</th>
                      <th>Actions</th>
                    </tr>
                    <tr>
                      <th>
                        <Form.Check
                          checked={selectedItems.length === getImagesByCategory(category).length && getImagesByCategory(category).length > 0}
                          onChange={(e) => handleSelectAll(getImagesByCategory(category), e.target.checked)}
                        />
                      </th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {getImagesByCategory(category).map((image) => (
                      <tr key={image._id}>
                        <td>
                          <Form.Check
                            checked={selectedItems.includes(image._id)}
                            onChange={(e) => handleSelectItem(image._id, e.target.checked)}
                          />
                        </td>
                        <td>{image.title}</td>
                        <td>
                          <Badge bg={image.isActive ? 'success' : 'danger'}>
                            {image.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>{image.order}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(image)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(image._id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>
        ))}
      </Tabs>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingImage ? 'Edit Image' : 'Add New Image'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.concat(['logo']).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Product Image *</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const formDataUpload = new FormData();
                    formDataUpload.append('image', file);

                    try {
                      const response = await fetch('http://localhost:5000/api/images/upload', {
                        method: 'POST',
                        body: formDataUpload
                      });

                      if (response.ok) {
                        const result = await response.json();
                        setFormData({...formData, imageUrl: result.imageUrl});
                      } else {
                        alert('Image upload failed');
                      }
                    } catch (error) {
                      console.error('Upload error:', error);
                      alert('Image upload failed');
                    }
                  }
                }}
                required={!editingImage}
              />
              {formData.imageUrl && (
                <div className="mt-2">
                  <img
                    src={formData.imageUrl.startsWith('/uploads/') ? `http://localhost:5000${formData.imageUrl}` : formData.imageUrl}
                    alt="Preview"
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Alt Text</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.altText}
                    onChange={(e) => setFormData({...formData, altText: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Order</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price ($)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Color</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Specifications</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.specifications}
                onChange={(e) => setFormData({...formData, specifications: e.target.value})}
                placeholder="Enter product specifications..."
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Weight</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    placeholder="e.g., 200g"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Dimensions</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                    placeholder="e.g., 10x5x3 cm"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Warranty</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.warranty}
                    onChange={(e) => setFormData({...formData, warranty: e.target.value})}
                    placeholder="e.g., 1 year"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tags (comma separated)</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)})}
                    placeholder="wireless, bluetooth, noise-cancelling"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : (editingImage ? 'Update' : 'Add')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
    </div>
  );
};

export default AdminDashboard;