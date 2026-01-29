import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, isAdmin, loading: authLoading, register, loginWithGoogle, loginWithFacebook } = useAuth();
    const navigate = useNavigate();

    // Sử dụng useEffect để chuyển hướng khi trạng thái đăng nhập thay đổi và đã settled
    React.useEffect(() => {
        if (user && !authLoading) {
            if (isAdmin) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    }, [user, isAdmin, authLoading, navigate]);

    const handleSocialLogin = async (provider) => {
        try {
            setError('');
            setLoading(true);
            await (provider === 'google' ? loginWithGoogle() : loginWithFacebook());
            // Không navigate ở đây, để useEffect lo
        } catch (err) {
            setError(`Đăng ký bằng ${provider} thất bại: ` + (err.message || 'Lỗi không xác định'));
            console.error(err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setError('Mật khẩu xác nhận không khớp.');
        }

        try {
            setError('');
            setLoading(true);
            await register(email, password);
            // Không navigate ở đây, để useEffect lo
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Email này đã được sử dụng cho một tài khoản khác.');
            } else if (err.code === 'auth/weak-password') {
                setError('Mật khẩu quá yếu. Vui lòng nhập ít nhất 6 ký tự.');
            } else if (err.code === 'auth/operation-not-allowed') {
                setError('Đăng ký bằng Email/Mật khẩu chưa được bật trong Firebase Console.');
            } else {
                setError('Đăng ký thất bại: ' + (err.message || 'Lỗi không xác định'));
            }
            setLoading(false);
        }
    };

    return (
        <div className="register-page" style={{ paddingTop: '150px', paddingBottom: '100px' }}>
            <div className="container" style={{ maxWidth: '500px' }}>
                <div className="glass" style={{ padding: '40px', borderRadius: '32px' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '32px', fontWeight: '900' }}>Đăng Ký Tài Khoản</h2>

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
                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                            {loading ? 'Đang xử lý...' : 'Đăng Ký'}
                        </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', color: 'var(--text-muted)' }}>
                        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                        <span style={{ padding: '0 12px', fontSize: '0.85rem' }}>Hoặc đăng ký bằng</span>
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

                    <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)' }}>
                        Đã có tài khoản? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>Đăng nhập ngay</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
