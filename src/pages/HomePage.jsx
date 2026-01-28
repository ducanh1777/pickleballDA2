import React from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { Link } from 'react-router-dom';

const HomePage = ({ onAddToCart }) => {
    const featuredProducts = products.slice(0, 4);

    return (
        <div className="home-page">
            <Hero />

            <section className="products-section container">
                <div className="section-header animate" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                    <div>
                        <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '8px' }}>Sản Phẩm Nổi Bật</h2>
                        <p className="section-subtitle" style={{ textAlign: 'left', marginBottom: 0 }}>Những thiết bị được ưa chuộng nhất tuần này</p>
                    </div>
                    <Link to="/products" className="btn-secondary" style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--primary)', color: 'var(--primary)', fontWeight: '700' }}>
                        Xem Tất Cả →
                    </Link>
                </div>

                <div className="product-grid">
                    {featuredProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={onAddToCart}
                        />
                    ))}
                </div>
            </section>

            <section className="promo-banner container animate" style={{ padding: '80px 0' }}>
                <div className="glass" style={{ padding: '60px', borderRadius: '40px', textAlign: 'center', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', color: 'white' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '16px' }}>Ưu Đãi Đặc Biệt</h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '32px', opacity: 0.9 }}>Giảm giá lên đến 20% cho tất cả các dòng vợt Selkirk chính hãng</p>
                    <Link to="/products" className="btn-primary" style={{ background: 'white', color: 'var(--primary-dark)', boxShadow: 'none' }}>
                        Khám Phá Ngay
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
