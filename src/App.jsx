import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Cart from './components/Cart';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import { products } from './data/products';

import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import OrderHistoryPage from './pages/OrderHistoryPage';

// ScrollToTop component to reset scroll on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const removeFromCart = (index) => {
    const newItems = cartItems.filter((_, i) => i !== index);
    setCartItems(newItems);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="App">
          <Header
            cartCount={cartItems.length}
            onCartClick={() => setIsCartOpen(true)}
          />

          <main>
            <Routes>
              <Route path="/" element={<HomePage onAddToCart={addToCart} />} />
              <Route path="/products" element={<ProductsPage onAddToCart={addToCart} />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/checkout" element={<CheckoutPage items={cartItems} onClearCart={clearCart} />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/my-orders" element={<OrderHistoryPage />} />
              <Route path="/product/:id" element={<ProductDetailsPage onAddToCart={addToCart} />} />
            </Routes>
          </main>

          <footer>
            <div className="container footer-content">
              <div className="footer-logo">Đức Anh <span>Pickleball Shop</span></div>
              <p>&copy; 2026 Đức Anh Pickleball Shop. Tất cả quyền được bảo lưu.</p>
              <div style={{ marginTop: '24px', color: 'var(--primary-dark)', letterSpacing: '2px', fontWeight: '800', fontSize: '0.9rem' }}>
                LUÔN LUÔN TIẾN BỘ - NÂNG TẦM TRÒ CHƠI
              </div>
            </div>
          </footer>

          <Cart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cartItems}
            onRemove={removeFromCart}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
