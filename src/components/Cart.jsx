import React from 'react';

const Cart = ({ isOpen, onClose, items, onRemove }) => {
    const total = items.reduce((sum, item) => sum + item.price, 0);

    return (
        <>
            <div
                className={`overlay ${isOpen ? 'visible' : ''}`}
                onClick={onClose}
            ></div>
            <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2>Giỏ Hàng</h2>
                    <button className="close-cart" onClick={onClose}>&times;</button>
                </div>

                <div className="cart-items">
                    {items.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>Giỏ hàng của bạn đang trống.</p>
                    ) : (
                        items.map((item, index) => (
                            <div key={index} className="cart-item animate">
                                <img src={item.image} alt={item.name} className="cart-item-img" />
                                <div className="cart-item-info">
                                    <h4>{item.name}</h4>
                                    <p className="cart-item-price">{item.price.toLocaleString('vi-VN')} VNĐ</p>
                                    <button
                                        className="remove-btn"
                                        onClick={() => onRemove(index)}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total">
                            <span>Tổng cộng</span>
                            <span>{total.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                        <button className="checkout-btn">Thanh Toán Ngay</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Cart;
