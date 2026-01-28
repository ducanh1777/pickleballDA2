import React from 'react';
import Contact from '../components/Contact';

const ContactPage = () => {
    return (
        <div className="contact-page" style={{ paddingTop: '120px' }}>
            <Contact />

            <section className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
                <div className="glass" style={{ padding: '60px', borderRadius: '40px' }}>
                    <h2 style={{ marginBottom: '32px', fontWeight: '900' }}>Gửi Tin Nhắn Cho Chúng Tôi</h2>
                    <form style={{ maxWidth: '600px', margin: '0 auto', display: 'grid', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <input type="text" placeholder="Họ và tên" style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: '#f8fafc' }} />
                            <input type="email" placeholder="Email" style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: '#f8fafc' }} />
                        </div>
                        <input type="text" placeholder="Chủ đề" style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: '#f8fafc' }} />
                        <textarea placeholder="Tin nhắn của bạn" rows="5" style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: '#f8fafc' }}></textarea>
                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Gửi Ngay</button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
