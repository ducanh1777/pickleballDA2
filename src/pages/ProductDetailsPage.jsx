import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';

const ProductDetailsPage = ({ onAddToCart }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = products.find(p => p.id === parseInt(id));

    if (!product) {
        return (
            <div className="container" style={{ paddingTop: '150px', textAlign: 'center' }}>
                <h2>Sản phẩm không tồn tại</h2>
                <button onClick={() => navigate('/products')} className="btn-primary" style={{ marginTop: '20px' }}>Quay lại cửa hàng</button>
            </div>
        );
    }

    const handleImageError = (e) => {
        const fallbacks = {
            'Vợt (Paddles)': 'https://images.unsplash.com/photo-1626224580175-342426bee7e3?auto=format&fit=crop&q=80&w=800',
            'Giày (Shoes)': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
            'Quần Áo (Apparel)': 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800',
            'default': 'https://images.unsplash.com/photo-1699047970868-8f81077755e1?auto=format&fit=crop&q=80&w=800'
        };
        e.target.src = fallbacks[product.category] || fallbacks['default'];
    };

    return (
        <div className="product-detail-page" style={{ paddingTop: '150px', paddingBottom: '100px' }}>
            <div className="container">
                <button onClick={() => navigate(-1)} style={{ marginBottom: '30px', fontWeight: '700', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    ← Quay lại
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px', alignItems: 'start' }}>
                    <div className="glass" style={{ padding: '40px', borderRadius: '32px', textAlign: 'center' }}>
                        <img
                            src={product.image}
                            alt={product.name}
                            onError={handleImageError}
                            style={{ maxWidth: '100%', height: 'auto', borderRadius: '16px', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))' }}
                        />
                    </div>

                    <div style={{ padding: '20px 0' }}>
                        <div style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '100px', background: 'rgba(118, 185, 0, 0.1)', color: 'var(--primary)', fontWeight: '700', fontSize: '0.8rem', marginBottom: '16px' }}>
                            {product.category}
                        </div>
                        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-dark)', marginBottom: '16px', lineHeight: '1.1' }}>
                            {product.name}
                        </h1>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '32px', fontWeight: '600' }}>
                            Thương hiệu: <span style={{ color: 'var(--primary-dark)' }}>{product.brand}</span>
                        </p>

                        <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary-dark)', marginBottom: '32px' }}>
                            {product.price.toLocaleString('vi-VN')} đ
                        </div>

                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '40px' }}>
                            {product.description}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <button
                                onClick={() => onAddToCart(product)}
                                className="btn-primary"
                                style={{ width: '100%', padding: '20px', fontSize: '1.1rem' }}
                            >
                                Thêm vào giỏ hàng
                            </button>
                            <button
                                className="btn-secondary"
                                style={{ width: '100%', padding: '20px', fontSize: '1.1rem', borderRadius: '16px' }}
                            >
                                Mua ngay
                            </button>
                        </div>

                        <div style={{ marginTop: '40px', padding: '24px', borderRadius: '20px', background: '#f8fafc', borderLeft: '4px solid var(--primary)' }}>
                            <h4 style={{ marginBottom: '8px' }}>Chính sách của Đức Anh Shop</h4>
                            <ul style={{ color: 'var(--text-muted)', fontSize: '0.95rem', display: 'grid', gap: '8px' }}>
                                <li>✓ Cam kết hàng chính hãng 100%</li>
                                <li>✓ Miễn phí vận chuyển cho đơn hàng trên 2Tr</li>
                                <li>✓ Bảo hành 1-1 trong 7 ngày nếu có lỗi từ nhà sản xuất</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
