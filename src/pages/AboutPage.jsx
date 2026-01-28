import React from 'react';

const AboutPage = () => {
    return (
        <div className="about-page" style={{ paddingTop: '120px' }}>
            <section className="container" style={{ padding: '80px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
                    <div className="animate">
                        <h2 className="section-title" style={{ textAlign: 'left', fontSize: '3rem' }}>Về <span>Đức Anh Pickleball</span></h2>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.8' }}>
                            Đức Anh Pickleball Shop ra đời từ niềm đam mê mãnh liệt với môn thể thao pickleball đầy sôi động.
                            Chúng tôi nhận thấy nhu cầu ngày càng tăng về các trang thiết bị chất lượng cao,
                            đáp ứng tiêu chuẩn thi đấu chuyên nghiệp cho cộng đồng người chơi tại Việt Nam.
                        </p>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '32px', lineHeight: '1.8' }}>
                            Sứ mệnh của chúng tôi là đem lại sự kết hợp hoàn hảo giữa công nghệ hàng đầu từ các thương hiệu quốc tế
                            và sự thấu hiểu cộng đồng từ các thương hiệu uy tín trong nước như Kamito và VNB.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="glass" style={{ padding: '24px', textAlign: 'center', borderRadius: '20px' }}>
                                <h3 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: '900' }}>100%</h3>
                                <p style={{ fontWeight: '700' }}>Chính Hãng</p>
                            </div>
                            <div className="glass" style={{ padding: '24px', textAlign: 'center', borderRadius: '20px' }}>
                                <h3 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: '900' }}>24/7</h3>
                                <p style={{ fontWeight: '700' }}>Hỗ Trợ Nhiệt Tình</p>
                            </div>
                        </div>
                    </div>
                    <div className="animate" style={{ position: 'relative' }}>
                        <img
                            src="https://images.unsplash.com/photo-1699047970868-8f81077755e1?auto=format&fit=crop&q=80&w=800"
                            alt="Pickleball Life"
                            style={{ width: '100%', borderRadius: '40px', boxShadow: 'var(--shadow)' }}
                        />
                        <div className="glass" style={{ position: 'absolute', bottom: '-30px', left: '-30px', padding: '30px', borderRadius: '30px', borderLeft: '8px solid var(--primary)' }}>
                            <p style={{ fontWeight: '800', fontSize: '1.5rem' }}>Since 2026</p>
                            <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Nâng tầm trải nghiệm của bạn</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
