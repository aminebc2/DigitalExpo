import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-links">
                    <div className="contact-section">
                        <span className="contact-label">CONTACT US</span>
                    </div>

                    <nav className="footer-nav">
                        <a href="/home">Home</a>
                        <a href="/associations">Associations</a>
                        <a href="/aboutus">About Us</a>
                    </nav>
                </div>

                <div className="footer-content">
                    <div className="company-info">
                        <img src="/Digi-expo.png" alt="DXC Technology" className="footer-logo" />
                        <p className="company-description">
                            DXC Technology (NYSE: DXC) helps global companies run their mission critical systems and operations while
                            modernizing IT, optimizing data architectures, and ensuring security and scalability across public, private and hybrid
                            clouds. With decades of driving innovation, the world's largest companies trust DXC to provide services across the
                            Enterprise Technology Stack to deliver new levels of performance, competitiveness and customer experiences.
                        </p>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="legal-links">
                        <a href="/legal"></a>
                        <span></span>
                        <a href="/privacy"></a>
                        <span></span>
                        <a href="/sitemap"></a>
                    </div>
                    <div className="copyright">
                        © DXC Technology Company
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;