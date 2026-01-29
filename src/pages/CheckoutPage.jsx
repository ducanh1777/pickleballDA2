import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CheckoutPage = ({ items, onClearCart }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        note: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const total = items.reduce((acc, item) => acc + item.price, 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (items.length === 0) return;

        try {
            setLoading(true);
            const orderData = {
                userId: user?.uid || 'guest',
                userEmail: user?.email || 'guest',
                customerInfo: formData,
                items: items,
                total: total,
                status: 'pending',
                createdAt: serverTimestamp()
            };

            await addDoc(collection(db, 'orders'), orderData);

            setSuccess(true);
            onClearCart();
            setTimeout(() => navigate('/'), 3000);
        } catch (error) {
            console.error('Firestore Error:', error);
            if (error.code === 'permission-denied') {
                alert('Lỗi: Quyền truy cập bị từ chối. Bạn hãy kiểm tra lại Rules của Firestore (để chế độ Test Mode hoặc cho phép ghi).');
            } else {
                alert('Có lỗi xảy ra khi đặt hàng: ' + (error.message || 'Lỗi không xác định'));
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="container" style={{ paddingTop: '150px', textAlign: 'center', height: '100vh' }}>
                <div className="glass" style={{ padding: '60px', borderRadius: '40px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '16px' }}>Đặt hàng thành công!</h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Cảm ơn bạn đã tin tưởng Đức Anh Shop. Chúng tôi sẽ sớm liên hệ xác nhận đơn hàng.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page" style={{ paddingTop: '150px', paddingBottom: '100px' }}>
            <div className="container">
                <h1 style={{ marginBottom: '40px', fontWeight: '900' }}>Thanh Toán</h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px', alignItems: 'start' }}>
                    <div className="glass" style={{ padding: '40px', borderRadius: '32px' }}>
                        <h3 style={{ marginBottom: '24px' }}>Thông tin giao hàng</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Họ và tên</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Số điện thoại</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Địa chỉ nhận hàng</label>
                                <textarea
                                    required
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '100px' }}
                                />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Ghi chú (nếu có)</label>
                                <input
                                    type="text"
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                />
                            </div>
                            <button
                                disabled={loading || items.length === 0}
                                type="submit"
                                className="btn-primary"
                                style={{ width: '100%', padding: '18px', marginTop: '20px' }}
                            >
                                {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
                            </button>
                        </form>
                    </div>

                    <div className="glass" style={{ padding: '30px', borderRadius: '32px', position: 'sticky', top: '120px' }}>
                        <h3 style={{ marginBottom: '20px' }}>Tóm tắt đơn hàng</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '24px' }}>
                            {items.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                                    <span>{item.name}</span>
                                    <span style={{ fontWeight: '700' }}>{item.price.toLocaleString('vi-VN')} đ</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '700' }}>Tổng cộng:</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary-dark)' }}>{total.toLocaleString('vi-VN')} đ</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
