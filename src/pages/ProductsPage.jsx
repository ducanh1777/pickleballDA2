import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../data/products';
import Pagination from '../components/Pagination';

const ProductsPage = ({ onAddToCart }) => {
    const [allProducts, setAllProducts] = useState([]);
    const [category, setCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Set items per page

    const categories = ['All', 'Vợt (Paddles)', 'Giày (Shoes)', 'Quần Áo (Apparel)', 'Phụ Kiện (Bags)', 'Bóng (Balls)', 'Thiết Bị (Equipment)'];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const data = await getProducts();
            setAllProducts(data);
            setLoading(false);
        };
        fetchProducts();
    }, []);

    const filteredProducts = category === 'All'
        ? allProducts
        : allProducts.filter(p => p.category === category);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    // Reset to page 1 on category change
    useEffect(() => {
        setCurrentPage(1);
    }, [category]);

    return (
        <div className="products-page" style={{ paddingTop: '120px', minHeight: '100vh' }}>
            <div className="container">
                <div className="products-layout">
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

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                                <div className="loader">Đang tải sản phẩm...</div>
                            </div>
                        ) : (
                            <div className="product-grid">
                                {currentItems.map(product => (
                                    <ProductCard
                                        key={product.id || product._id}
                                        product={product}
                                        onAddToCart={onAddToCart}
                                    />
                                ))}
                            </div>
                        )}

                        <Pagination
                            currentPage={currentPage}
                            totalItems={filteredProducts.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                        />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
