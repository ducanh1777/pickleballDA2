import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

import { useAuth } from '../context/AuthContext';

const Header = ({ cartCount, onCartClick }) => {
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    return (
        <header className={`header ${scrolled ? 'glass scrolled' : ''}`}>
            <div className="container header-inner">
                <Link to="/" className="logo">
                    <img src={logo} alt="Duc Anh Pickleball" />
                </Link>
                <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
                    <ul className="nav-links">
                        {user && (
                            <li className="mobile-only greeting-mobile">
                                <div style={{ padding: '20px', background: 'rgba(118, 185, 0, 0.1)', borderRadius: '16px', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'block' }}>Xin chào,</span>
                                    <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>
                                        {user.displayName || user.email.split('@')[0]} 👋
                                    </span>
                                </div>
                            </li>
                        )}
                        <li><Link to="/" onClick={() => setIsMenuOpen(false)} style={{ color: !isHome && !scrolled && !isMenuOpen ? 'var(--text-dark)' : undefined }}>Trang chủ</Link></li>
                        <li><Link to="/products" onClick={() => setIsMenuOpen(false)} style={{ color: !isHome && !scrolled && !isMenuOpen ? 'var(--text-dark)' : undefined }}>Sản phẩm</Link></li>
                        {user?.role === 'admin' && (
                            <li><Link to="/admin" onClick={() => setIsMenuOpen(false)} style={{ color: location.pathname === '/admin' ? 'var(--primary)' : (!isHome && !scrolled && !isMenuOpen ? 'var(--text-dark)' : undefined), fontWeight: location.pathname === '/admin' ? '900' : '500' }}>Quản trị</Link></li>
                        )}
                        {user && (
                            <li><Link to="/my-orders" onClick={() => setIsMenuOpen(false)} style={{ color: !isHome && !scrolled && !isMenuOpen ? 'var(--text-dark)' : undefined }}>Đơn hàng</Link></li>
                        )}
                        <li><Link to="/about" onClick={() => setIsMenuOpen(false)} style={{ color: !isHome && !scrolled && !isMenuOpen ? 'var(--text-dark)' : undefined }}>Về chúng tôi</Link></li>
                        <li><Link to="/contact" onClick={() => setIsMenuOpen(false)} style={{ color: !isHome && !scrolled && !isMenuOpen ? 'var(--text-dark)' : undefined }}>Liên hệ</Link></li>
                        {user && (
                            <li className="mobile-only"><button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--text-dark)', fontWeight: '600', width: '100%', textAlign: 'left', fontSize: '1.2rem', padding: '0' }}>Thoát</button></li>
                        )}
                        {!user && (
                            <li className="mobile-only"><Link to="/login" onClick={() => setIsMenuOpen(false)}>Đăng nhập</Link></li>
                        )}
                    </ul>
                </nav>
                <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {user ? (
                        <div className="mobile-hide" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div className="user-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: !isHome && !scrolled ? 'rgba(0,0,0,0.05)' : (scrolled ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'), borderRadius: '20px', border: scrolled || (!isHome && !scrolled) ? '1px solid var(--text-dark)' : '1px solid white' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: scrolled || (!isHome && !scrolled) ? 'var(--text-dark)' : 'white' }}>
                                    Hi, {user.displayName?.split(' ').pop() || user.email.split('@')[0]}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                style={{ background: 'none', border: 'none', color: scrolled || (!isHome && !scrolled) ? 'var(--text-dark)' : 'rgba(255,255,255,0.8)', fontWeight: '600', cursor: 'pointer', fontSize: '0.75rem' }}
                            >
                                Thoát
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="login-link-header mobile-hide"
                            style={{ color: !isHome && !scrolled ? 'var(--text-dark)' : 'white', fontWeight: '700' }}
                        >
                            Đăng nhập
                        </Link>
                    )}
                    <button className={`cart-icon ${scrolled || !isHome ? 'dark' : ''}`} onClick={onCartClick}>
                        <span>🛒</span>
                        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </button>
                    <button
                        className={`hamburger ${scrolled || !isHome ? 'dark' : ''} ${isMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Menu"
                    >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6H20M4 12H20M4 18H20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                {isMenuOpen && <div className="menu-overlay" onClick={() => setIsMenuOpen(false)}></div>}
            </div>
        </header>
    );
};

export default Header;
