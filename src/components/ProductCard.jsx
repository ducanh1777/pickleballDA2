import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
    const handleImageError = (e) => {
        // High-quality generic fallback based on category
        const fallbacks = {
            'Vợt (Paddles)': 'https://images.unsplash.com/photo-1626224580175-342426bee7e3?auto=format&fit=crop&q=80&w=800',
            'Giày (Shoes)': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
            'Quần Áo (Apparel)': 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800',
            'default': 'https://images.unsplash.com/photo-1699047970868-8f81077755e1?auto=format&fit=crop&q=80&w=800'
        };
        e.target.src = fallbacks[product.category] || fallbacks['default'];
    };

    return (
        <div className="product-card glass animate">
            <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                <div className="product-image">
                    <img
                        src={product.image}
                        alt={product.name}
                        onError={handleImageError}
                    />
                </div>
                <div className="product-info">
                    <span className="product-category">{product.category}</span>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">{product.price.toLocaleString('vi-VN')} đ</p>
                    <button
                        className="btn-primary add-to-cart"
                        onClick={(e) => {
                            e.preventDefault();
                            onAddToCart(product);
                        }}
                    >
                        Thêm vào giỏ
                    </button>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
