import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../data/products';
import { db } from '../config/firebase';
import { collection, getDocs, doc, updateDoc, query, orderBy, deleteDoc, addDoc } from 'firebase/firestore';
import Pagination from '../components/Pagination';

const AdminPage = () => {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('products'); // 'products', 'orders', or 'users'

    // Pagination states
    const [pPage, setPPage] = useState(1);
    const [oPage, setOPage] = useState(1);
    const [uPage, setUPage] = useState(1);
    const itemsPerPage = 8;
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'Vợt (Paddles)',
        brand: '',
        description: '',
        image: ''
    });


    useEffect(() => {
        if (!user || !isAdmin) {
            navigate('/login');
            return;
        }
        fetchProducts();
        fetchOrders();
        fetchUsers();
    }, [user, isAdmin, navigate]);

    const fetchProducts = async () => {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setLoading(false);
    };

    const fetchOrders = async () => {
        try {
            const ordersRef = collection(db, 'orders');
            const q = query(ordersRef, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const usersRef = collection(db, 'users');
            const querySnapshot = await getDocs(usersRef);
            if (querySnapshot.empty) {
                console.log('No users found in Firestore. Try logging out and back in.');
            }
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            if (error.code === 'permission-denied') {
                alert('Lỗi: Bạn chưa có quyền đọc danh sách người dùng. Hãy cập nhật Firestore Rules.');
            }
        }
    };

    const handleToggleUserStatus = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
        const action = newStatus === 'blocked' ? 'khóa' : 'mở khóa';
        if (!window.confirm(`Bạn có chắc muốn ${action} người dùng này?`)) return;

        try {
            await updateDoc(doc(db, 'users', userId), { status: newStatus });
            fetchUsers();
            alert(`Đã ${action} người dùng thành công!`);
        } catch (error) {
            console.error(`Error ${action} user:`, error);
            alert(`Có lỗi xảy ra khi ${action} người dùng.`);
        }
    };

    const handleAcceptOrder = async (orderId) => {
        try {
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, { status: 'accepted' });
            alert('Đã duyệt đơn hàng thành công!');
            fetchOrders();
        } catch (error) {
            console.error('Error accepting order:', error);
            alert('Có lỗi xảy ra khi duyệt đơn.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const productData = { ...formData, price: Number(formData.price) };
            if (editingProduct) {
                await updateProduct(editingProduct.id, productData);
            } else {
                await addProduct(productData);
            }

            setShowForm(false);
            setEditingProduct(null);
            setFormData({ name: '', price: '', category: 'Vợt (Paddles)', brand: '', description: '', image: '' });
            fetchProducts();
            alert(editingProduct ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!');
        } catch (error) {
            console.error('Error saving product:', error);
            alert(`Có lỗi xảy ra khi lưu sản phẩm: ${error.message || error}`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
        try {
            await deleteProduct(id);
            fetchProducts();
            alert('Xóa sản phẩm thành công!');
        } catch (error) {
            console.error('Error deleting product:', error);
            alert(`Có lỗi xảy ra khi xóa sản phẩm: ${error.message || error}`);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            category: product.category,
            brand: product.brand,
            description: product.description,
            image: product.image
        });
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    if (loading) return <div style={{ paddingTop: '150px', textAlign: 'center' }}>Đang tải...</div>;

    return (
        <div className="admin-page" style={{ paddingTop: '120px', paddingBottom: '100px' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontWeight: '900' }}>Admin Dashboard</h1>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={activeTab === 'products' ? 'btn-primary' : ''}
                            style={{ padding: '10px 20px', borderRadius: '10px', background: activeTab === 'products' ? 'var(--primary)' : '#f1f5f9', color: activeTab === 'products' ? 'white' : 'var(--text-dark)', fontWeight: '700' }}
                        >
                            Sản phẩm
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={activeTab === 'orders' ? 'btn-primary' : ''}
                            style={{ padding: '10px 20px', borderRadius: '10px', background: activeTab === 'orders' ? 'var(--primary)' : '#f1f5f9', color: activeTab === 'orders' ? 'white' : 'var(--text-dark)', fontWeight: '700' }}
                        >
                            Đơn hàng
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={activeTab === 'users' ? 'btn-primary' : ''}
                            style={{ padding: '10px 20px', borderRadius: '10px', background: activeTab === 'users' ? 'var(--primary)' : '#f1f5f9', color: activeTab === 'users' ? 'white' : 'var(--text-dark)', fontWeight: '700' }}
                        >
                            Người dùng
                        </button>
                    </div>
                </div>

                {activeTab === 'products' ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                            <button
                                onClick={() => { setShowForm(!showForm); setEditingProduct(null); }}
                                style={{ color: 'var(--primary-dark)', fontWeight: '800', fontSize: '1rem' }}
                            >
                                {showForm ? '✖ Đóng Form' : '➕ Thêm sản phẩm mới'}
                            </button>
                        </div>

                        {showForm && (
                            <div className="glass animate" style={{ padding: '40px', borderRadius: '32px', marginBottom: '40px' }}>
                                <h3 style={{ marginBottom: '24px' }}>{editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h3>
                                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    {/* ... (keep existing form fields) */}
                                    <div className="input-group">
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Tên sản phẩm</label>
                                        <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                                    </div>
                                    <div className="input-group">
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Giá (VNĐ)</label>
                                        <input required type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                                    </div>
                                    <div className="input-group">
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Danh mục</label>
                                        <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                            <option>Vợt (Paddles)</option>
                                            <option>Giày (Shoes)</option>
                                            <option>Quần Áo (Apparel)</option>
                                            <option>Phụ Kiện (Bags)</option>
                                            <option>Phụ Kiện (Accessories)</option>
                                            <option>Bóng (Balls)</option>
                                            <option>Thiết Bị (Equipment)</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Thương hiệu</label>
                                        <input type="text" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                                    </div>
                                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>URL Hình ảnh</label>
                                        <input required type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                                    </div>
                                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Mô tả</label>
                                        <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '80px' }} />
                                    </div>
                                    <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2', padding: '16px' }}>
                                        {editingProduct ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
                                    </button>
                                </form>
                            </div>
                        )}

                        <div className="glass" style={{ padding: '0', borderRadius: '32px', overflow: 'hidden' }}>
                            <div className="table-responsive">
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                                    <thead style={{ background: '#f8fafc', fontWeight: '700' }}>
                                        <tr>
                                            <th style={{ padding: '20px' }}>Sản phẩm</th>
                                            <th style={{ padding: '20px' }}>Danh mục</th>
                                            <th style={{ padding: '20px' }}>Giá</th>
                                            <th style={{ padding: '20px' }}>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.slice((pPage - 1) * itemsPerPage, pPage * itemsPerPage).map(p => (
                                            <tr key={p.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                                                <td style={{ padding: '20px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <img src={p.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '8px' }} />
                                                        <span style={{ fontWeight: '600' }}>{p.name}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '20px', color: 'var(--text-muted)' }}>{p.category}</td>
                                                <td style={{ padding: '20px', fontWeight: '700' }}>{p.price?.toLocaleString('vi-VN')} đ</td>
                                                <td style={{ padding: '20px' }}>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <button onClick={() => handleEdit(p)} style={{ color: 'var(--primary-dark)' }}>Sửa</button>
                                                        <button onClick={() => handleDelete(p.id)} style={{ color: '#ef4444' }}>Xóa</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <Pagination
                            currentPage={pPage}
                            totalItems={products.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={(page) => { setPPage(page); window.scrollTo(0, 0); }}
                        />
                    </>
                ) : activeTab === 'orders' ? (
                    <>
                        <div className="glass" style={{ padding: '0', borderRadius: '32px', overflow: 'hidden' }}>
                            <div className="table-responsive">
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                                    <thead style={{ background: '#f8fafc', fontWeight: '700' }}>
                                        {/* ... same as before ... */}
                                        <tr>
                                            <th style={{ padding: '20px' }}>Khách hàng</th>
                                            <th style={{ padding: '20px' }}>Sản phẩm</th>
                                            <th style={{ padding: '20px' }}>Tổng tiền</th>
                                            <th style={{ padding: '20px' }}>Trạng thái</th>
                                            <th style={{ padding: '20px' }}>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.slice((oPage - 1) * itemsPerPage, oPage * itemsPerPage).map(o => (
                                            <tr key={o.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                                                <td style={{ padding: '20px' }}>
                                                    <div style={{ fontWeight: '700' }}>{o.customerInfo?.name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{o.customerInfo?.phone}</div>
                                                </td>
                                                <td style={{ padding: '20px' }}>
                                                    {o.items?.map((item, i) => (
                                                        <div key={i} style={{ fontSize: '0.85rem' }}>• {item.name}</div>
                                                    ))}
                                                </td>
                                                <td style={{ padding: '20px', fontWeight: '800', color: 'var(--primary-dark)' }}>{o.total?.toLocaleString('vi-VN')} đ</td>
                                                <td style={{ padding: '20px' }}>
                                                    <span style={{
                                                        padding: '4px 10px',
                                                        borderRadius: '20px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '700',
                                                        background: o.status === 'accepted' ? '#dcfce7' : '#fef9c3',
                                                        color: o.status === 'accepted' ? '#166534' : '#854d0e'
                                                    }}>
                                                        {o.status === 'accepted' ? 'Đã duyệt' : 'Chờ xử lý'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '20px' }}>
                                                    {o.status !== 'accepted' && (
                                                        <button
                                                            onClick={() => handleAcceptOrder(o.id)}
                                                            style={{ background: 'var(--primary)', color: 'white', padding: '6px 12px', borderRadius: '8px', fontWeight: '700', fontSize: '0.85rem' }}
                                                        >
                                                            Chấp nhận
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {orders.length === 0 && (
                                            <tr>
                                                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có đơn hàng nào.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <Pagination
                            currentPage={oPage}
                            totalItems={orders.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={(page) => { setOPage(page); window.scrollTo(0, 0); }}
                        />
                    </>
                ) : (
                    <>
                        <div className="glass" style={{ padding: '0', borderRadius: '32px', overflow: 'hidden' }}>
                            <div className="table-responsive">
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                                    <thead style={{ background: '#f8fafc', fontWeight: '700' }}>
                                        <tr>
                                            <th style={{ padding: '20px' }}>Email</th>
                                            <th style={{ padding: '20px' }}>Tên</th>
                                            <th style={{ padding: '20px' }}>Trạng thái</th>
                                            <th style={{ padding: '20px' }}>Ngày tạo</th>
                                            <th style={{ padding: '20px' }}>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.slice((uPage - 1) * itemsPerPage, uPage * itemsPerPage).map(u => (
                                            <tr key={u.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                                                <td style={{ padding: '20px', fontWeight: '600' }}>{u.email}</td>
                                                <td style={{ padding: '20px' }}>{u.displayName || '---'}</td>
                                                <td style={{ padding: '20px' }}>
                                                    <span style={{
                                                        padding: '4px 10px',
                                                        borderRadius: '20px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '700',
                                                        background: u.status === 'blocked' ? '#fee2e2' : '#dcfce7',
                                                        color: u.status === 'blocked' ? '#991b1b' : '#166534'
                                                    }}>
                                                        {u.status === 'blocked' ? 'Đã khóa' : 'Hoạt động'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                                    {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString('vi-VN') : '---'}
                                                </td>
                                                <td style={{ padding: '20px' }}>
                                                    {u.role !== 'admin' && (
                                                        <button
                                                            onClick={() => handleToggleUserStatus(u.id, u.status)}
                                                            style={{
                                                                color: u.status === 'blocked' ? '#10b981' : '#ef4444',
                                                                fontWeight: '700'
                                                            }}
                                                        >
                                                            {u.status === 'blocked' ? 'Mở khóa' : 'Khóa'}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <Pagination
                            currentPage={uPage}
                            totalItems={users.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={(page) => { setUPage(page); window.scrollTo(0, 0); }}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
