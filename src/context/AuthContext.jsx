import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const url = "https://remixbeats-backend.onrender.com/api/admin/login";
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and set user
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // You can add token verification here
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem('beatsCart');
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      setCart(cartItems);
      setCartCount(cartItems.reduce((total, item) => total + item.quantity, 0));
    }

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('beatsFavorites');
    if (savedFavorites) {
      const favoritesArray = JSON.parse(savedFavorites);
      setFavorites(new Set(favoritesArray));
    }

    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('url/api/admin/login', {
        username,
        password
      });
      const { token, admin } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(admin);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const addToCart = (product) => {
    const newCart = [...cart];
    const existingItem = newCart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      newCart.push({
        id: product.id || product._id,
        title: product.title,
        imageUrl: product.imageUrl,
        price: 299, // Default price, can be made dynamic
        quantity: 1
      });
    }

    setCart(newCart);
    const totalCount = newCart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(totalCount);
    localStorage.setItem('beatsCart', JSON.stringify(newCart));
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    setCart(newCart);
    const totalCount = newCart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(totalCount);
    localStorage.setItem('beatsCart', JSON.stringify(newCart));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const newCart = cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCart(newCart);
    const totalCount = newCart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(totalCount);
    localStorage.setItem('beatsCart', JSON.stringify(newCart));
  };

  const addToFavorites = (productId) => {
   const newFavorites = new Set(favorites);
   newFavorites.add(productId);
   setFavorites(newFavorites);
   localStorage.setItem('beatsFavorites', JSON.stringify([...newFavorites]));
   // Force re-render of components that depend on favorites count
   window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: { count: newFavorites.size } }));
 };

  const removeFromFavorites = (productId) => {
   const newFavorites = new Set(favorites);
   newFavorites.delete(productId);
   setFavorites(newFavorites);
   localStorage.setItem('beatsFavorites', JSON.stringify([...newFavorites]));
   // Force re-render of components that depend on favorites count
   window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: { count: newFavorites.size } }));
 };

  const clearCart = () => {
    setCart([]);
    setCartCount(0);
    localStorage.removeItem('beatsCart');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    cart,
    cartCount,
    favorites,
    addToCart,
    removeFromCart,
    updateQuantity,
    addToFavorites,
    removeFromFavorites,
    clearCart
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};