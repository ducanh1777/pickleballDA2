import React from 'react';

const Contact = () => {
    return (
        <section id="contact" className="contact-section container">
            <div className="section-header animate">
                <h2 className="section-title">Liên Hệ Với Chúng Tôi</h2>
                <p className="section-subtitle">Đức Anh Pickleball Shop luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>
            </div>

            <div className="contact-grid">
                <a href="tel:0985936016" className="contact-card glass animate">
                    <div className="contact-icon phone">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </div>
                    <h3>Hotline</h3>
                    <p>0985.936.016</p>
                </a>

                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="contact-card glass animate" style={{ animationDelay: '0.1s' }}>
                    <div className="contact-icon facebook">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </div>
                    <h3>Facebook</h3>
                    <p>Đức Anh Pickleball</p>
                </a>

                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="contact-card glass animate" style={{ animationDelay: '0.2s' }}>
                    <div className="contact-icon instagram">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </div>
                    <h3>Instagram</h3>
                    <p>@ducanh.pickleball</p>
                </a>

                <a href="https://zalo.me" target="_blank" rel="noopener noreferrer" className="contact-card glass animate" style={{ animationDelay: '0.3s' }}>
                    <div className="contact-icon zalo">
                        <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>Zalo</span>
                    </div>
                    <h3>Zalo</h3>
                    <p>Kết nối ngay</p>
                </a>
            </div>
        </section>
    );
};

export default Contact;
