import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

import { useAuth } from '../context/AuthContext';

const Header = ({ cartCount, onCartClick }) => {
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
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
                <nav>
                    <ul className="nav-links">
                        <li><Link to="/" style={{ color: !isHome && !scrolled ? 'var(--text-dark)' : undefined }}>Trang chủ</Link></li>
                        <li><Link to="/products" style={{ color: !isHome && !scrolled ? 'var(--text-dark)' : undefined }}>Sản phẩm</Link></li>
                        {useAuth().isAdmin && (
                            <li><Link to="/admin" style={{ color: location.pathname === '/admin' ? 'var(--primary)' : (!isHome && !scrolled ? 'var(--text-dark)' : undefined), fontWeight: location.pathname === '/admin' ? '900' : '500' }}>Quản trị</Link></li>
                        )}
                        <li><Link to="/about" style={{ color: !isHome && !scrolled ? 'var(--text-dark)' : undefined }}>Về chúng tôi</Link></li>
                        <li><Link to="/contact" style={{ color: !isHome && !scrolled ? 'var(--text-dark)' : undefined }}>Liên hệ</Link></li>
                    </ul>
                </nav>
                <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <Link to="/my-orders" style={{ fontSize: '0.9rem', fontWeight: '700', color: !isHome && !scrolled ? 'var(--text-dark)' : 'white' }}>
                                Đơn hàng của tôi
                            </Link>
                            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--primary)' }}>
                                👋 {user.email.split('@')[0]}
                            </span>
                            <button
                                onClick={handleLogout}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: '600', cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                                Thoát
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            style={{ color: !isHome && !scrolled ? 'var(--text-dark)' : 'white', fontWeight: '700' }}
                        >
                            Đăng nhập
                        </Link>
                    )}
                    <button className={`cart-icon ${!isHome && !scrolled ? 'dark' : ''}`} onClick={onCartClick}>
                        <span>🛒</span>
                        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
