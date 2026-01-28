import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const ProductsPage = ({ onAddToCart }) => {
    const [category, setCategory] = useState('All');
    const categories = ['All', 'Vợt (Paddles)', 'Giày (Shoes)', 'Quần Áo (Apparel)', 'Phụ Kiện (Bags)', 'Bóng (Balls)', 'Thiết Bị (Equipment)'];

    const filteredProducts = category === 'All'
        ? products
        : products.filter(p => p.category === category);

    return (
        <div className="products-page" style={{ paddingTop: '120px', minHeight: '100vh' }}>
            <div className="container">
                <div className="products-layout" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '40px' }}>
                    <aside className="filters glass" style={{ padding: '24px', borderRadius: '24px', height: 'fit-content', position: 'sticky', top: '100px' }}>
                        <h3 style={{ marginBottom: '20px', fontWeight: '800' }}>Danh Mục</h3>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {categories.map(cat => (
                                <li key={cat}>
                                    <button
                                        onClick={() => setCategory(cat)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            width: '100%',
                                            textAlign: 'left',
                                            fontWeight: '600',
                                            background: category === cat ? 'var(--primary-dark)' : 'transparent',
                                            color: category === cat ? 'white' : 'var(--text-muted)'
                                        }}
                                    >
                                        {cat === 'All' ? 'Tất cả sản phẩm' : cat}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    <main>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: '900' }}>{category === 'All' ? 'Tất cả sản phẩm' : category}</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Hiển thị {filteredProducts.length} sản phẩm</p>
                        </div>

                        <div className="product-grid">
                            {filteredProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={onAddToCart}
                                />
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
