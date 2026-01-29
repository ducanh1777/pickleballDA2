import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, isAdmin, loading: authLoading, login, loginWithGoogle, loginWithFacebook, refreshRedirect } = useAuth();
    const navigate = useNavigate();

    const location = useLocation();

    // Sử dụng useEffect để chuyển hướng khi trạng thái đăng nhập thay đổi và đã settled
    React.useEffect(() => {
        if (user && !authLoading) {
            console.log("Login Page: User detected, navigating away...");
            if (isAdmin) {
                navigate('/admin');
            } else {
                const from = location.state?.from || '/';
                navigate(from);
            }
        }
    }, [user, isAdmin, authLoading, navigate, location.state]);

    const handleSocialLogin = async (provider) => {
        try {
            setError('');
            setLoading(true);
            await (provider === 'google' ? loginWithGoogle() : loginWithFacebook());
            // Không navigate ở đây, để useEffect lo
        } catch (err) {
            setError(`Đăng nhập bằng ${provider} thất bại: ` + (err.message || 'Lỗi không xác định'));
            console.error(err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            // Không navigate ở đây, để useEffect lo
        } catch (err) {
            setError('Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu.');
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <div className="login-page" style={{ paddingTop: '150px', paddingBottom: '100px' }}>
            <div className="container" style={{ maxWidth: '500px' }}>
                <div className="glass" style={{ padding: '40px', borderRadius: '32px' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '32px', fontWeight: '900' }}>Đăng Nhập</h2>

                    {authLoading && (
                        <div style={{ textAlign: 'center', margin: '20px 0', color: 'var(--primary)', fontWeight: '600' }}>
                            🔄 Đang kiểm tra tài khoản...
                        </div>
                    )}

                    {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white' }}
                            />
                        </div>
                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Mật khẩu</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white' }}
                            />
                        </div>
                        <button
                            disabled={loading}
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%', padding: '14px', marginTop: '10px' }}
                        >
                            {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
                        </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', color: 'var(--text-muted)' }}>
                        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                        <span style={{ padding: '0 12px', fontSize: '0.85rem' }}>Hoặc đăng nhập bằng</span>
                        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <button
                            onClick={() => handleSocialLogin('google')}
                            className="btn-social google"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: '600', fontSize: '0.9rem', width: '100%' }}
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" style={{ width: '18px' }} />
                            Google
                        </button>
                        <button
                            onClick={() => handleSocialLogin('facebook')}
                            className="btn-social facebook"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: '600', fontSize: '0.9rem', width: '100%' }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            Facebook
                        </button>
                    </div>

                    <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '20px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                        <h4 style={{ color: '#3b82f6', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.2rem' }}>💡</span> Hỗ trợ Đăng nhập Mobile
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '15px' }}>
                            Nếu bạn đã xác nhận Google nhưng vẫn bị kẹt ở đây, hãy thử nhấn nút làm mới bên dưới:
                        </p>
                        <button
                            onClick={refreshRedirect}
                            disabled={authLoading}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'white', border: '2px solid #3b82f6', color: '#3b82f6', fontWeight: '700', cursor: 'pointer', transition: '0.3s' }}
                        >
                            {authLoading ? '⌛ Đang kiểm tra...' : '🔄 Làm mới trạng thái tài khoản'}
                        </button>
                        <div style={{ marginTop: '15px', fontSize: '0.8rem', color: '#64748b' }}>
                            <strong>Mẹo:</strong>
                            <ul style={{ paddingLeft: '18px', marginTop: '5px' }}>
                                <li>Nếu dùng iPhone, hãy mở bằng <strong>Safari</strong> (không dùng trình duyệt của Zalo/FB).</li>
                                <li>Tắt <strong>Chế độ ẩn danh</strong> nếu đang bật.</li>
                                <li>Đảm bảo Safari không chặn <strong>Cookie bên thứ 3</strong>.</li>
                            </ul>
                        </div>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)' }}>
                        Chưa có tài khoản? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700' }}>Đăng ký ngay</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
