import React from 'react';
import heroBg from '../assets/hero_bg.png';
import { useAuth } from '../context/AuthContext';

const Hero = () => {
    const { user } = useAuth();

    return (
        <section id="hero" className="hero">
            <img
                src={heroBg}
                alt="Pickleball Hero"
                className="hero-image"
                loading="eager"
                fetchpriority="high"
            />
            <div className="container">
                <div className="hero-content animate">
                    {user && (
                        <div className="welcome-line" style={{ color: 'var(--primary)', fontWeight: '800', marginBottom: '16px', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            Rất vui được gặp lại, {user.displayName || user.email.split('@')[0]}!
                        </div>
                    )}
                    <h1>Nâng Tầm Trò Chơi Tại <span>Đức Anh Pickleball</span></h1>
                    <p>Trang thiết bị cao cấp cho vận động viên hiện đại. Thiết kế tinh tế, hiệu suất vượt trội từ các thương hiệu Việt Nam và Quốc tế.</p>
                    <a href="#products" className="btn-primary">Mua Sắm Ngay</a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
