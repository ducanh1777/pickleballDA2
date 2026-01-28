import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

const Header = ({ cartCount, onCartClick }) => {
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
                        <li><Link to="/about" style={{ color: !isHome && !scrolled ? 'var(--text-dark)' : undefined }}>Về chúng tôi</Link></li>
                        <li><Link to="/contact" style={{ color: !isHome && !scrolled ? 'var(--text-dark)' : undefined }}>Liên hệ</Link></li>
                    </ul>
                </nav>
                <button className={`cart-icon ${!isHome && !scrolled ? 'dark' : ''}`} onClick={onCartClick}>
                    <span>🛒</span>
                    {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </button>
            </div>
        </header>
    );
};

export default Header;
