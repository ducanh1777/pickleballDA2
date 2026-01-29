import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';
import { db } from '../config/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

const OrderHistoryPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchUserOrders();
    }, [user, navigate]);

    const fetchUserOrders = async () => {
        try {
            setLoading(true);
            const ordersRef = collection(db, 'orders');
            const q = query(
                ordersRef,
                where('userId', '==', user.uid),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders from Firestore:', error);
            // If the query fails due to missing index, handle it gracefully
            if (error.code === 'failed-precondition') {
                console.warn('Need a Firestore composite index for this query.');
                // Fallback: fetch all and filter in memory if necessary, 
                // but for now just show an alert
                alert('Hệ thống đang cập nhật chỉ mục, vui lòng thử lại sau vài phút.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ paddingTop: '150px', textAlign: 'center' }}>Đang tải lịch sử đơn hàng...</div>;

    return (
        <div className="order-history-page" style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '80vh' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <h1 style={{ marginBottom: '40px', fontWeight: '900' }}>Lịch Sử Đặt Hàng</h1>

                {orders.length === 0 ? (
                    <div className="glass" style={{ padding: '40px', textAlign: 'center', borderRadius: '32px' }}>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Bạn chưa có đơn đặt hàng nào.</p>
                        <button onClick={() => navigate('/products')} className="btn-primary" style={{ marginTop: '20px' }}>
                            Mua sắm ngay
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(order => (
                            <div key={order.id} className="glass animate" style={{ padding: '30px', borderRadius: '32px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>
                                    <div>
                                        <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Đơn hàng: #{order.id.slice(-6).toUpperCase()}</span>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            Ngày đặt: {order.createdAt ? new Date(order.createdAt._seconds * 1000).toLocaleDateString('vi-VN') : 'N/A'}
                                        </div>
                                    </div>
                                    <span style={{
                                        padding: '6px 16px',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: '800',
                                        background: order.status === 'accepted' ? '#dcfce7' : '#fef9c3',
                                        color: order.status === 'accepted' ? '#166534' : '#854d0e',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                                    }}>
                                        {order.status === 'accepted' ? '✓ Đã Duyệt' : '⏳ Chờ Xử Lý'}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {order.items?.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: '500' }}>{item.name}</span>
                                            <span>{item.price.toLocaleString('vi-VN')} đ</span>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '2px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: '700' }}>Tổng cộng:</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--primary-dark)' }}>
                                        {order.total?.toLocaleString('vi-VN')} đ
                                    </span>
                                </div>

                                {order.status === 'accepted' && (
                                    <div style={{ marginTop: '15px', padding: '12px', background: 'rgba(118, 185, 0, 0.05)', borderRadius: '12px', color: 'var(--primary-dark)', fontSize: '0.9rem', fontWeight: '600' }}>
                                        📢 Thông báo: Đơn hàng của bạn đã được quản trị viên duyệt và đang trong quá trình chuẩn bị giao.
                                    </div>
                                )}
                            </div>
                        ))}

                        <Pagination
                            currentPage={currentPage}
                            totalItems={orders.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={(page) => { setCurrentPage(page); window.scrollTo(0, 0); }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;
