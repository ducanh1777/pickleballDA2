import React from 'react';
import heroBg from '../assets/hero_bg.png';

const Hero = () => {
    return (
        <section id="hero" className="hero">
            <img
                src={heroBg}
                alt="Pickleball Hero"
                className="hero-image"
            />
            <div className="container">
                <div className="hero-content animate">
                    <h1>Nâng Tầm Trò Chơi Tại <span>Đức Anh Pickleball</span></h1>
                    <p>Trang thiết bị cao cấp cho vận động viên hiện đại. Thiết kế tinh tế, hiệu suất vượt trội từ các thương hiệu Việt Nam và Quốc tế.</p>
                    <a href="#products" className="btn-primary">Mua Sắm Ngay</a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
