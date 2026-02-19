import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';
import styles from './Footer.module.css';
import logo from '../../app/assets/logo.png';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.topSection}>

                    <div className={styles.brandSection}>
                        <div className={styles.brand}>
                            <img src={logo} alt="ESG Portal Logo" className={styles.logoImage} />
                            <span className={styles.logoText}>ESG Portal</span>
                        </div>
                        <p className={styles.tagline}>
                            Get your Sustainability Rating based on international standards and monitor the ESG performance of your Value Chain.
                        </p>
                    </div>

                    {/* Links Grid */}
                    <div className={styles.linksSection}>

                        {/* Sitemap */}
                        <div className={styles.column}>
                            <h3>Sitemap</h3>
                            <ul>
                                <li><Link to="/" className={styles.link}>Home</Link></li>
                                <li><Link to="/about" className={styles.link}>About</Link></li>
                                <li><Link to="/rating" className={styles.link}>ESG Rating</Link></li>
                                <li><Link to="/value-chain" className={styles.link}>ESG Value Chain</Link></li>
                                <li><Link to="/corporation" className={styles.link}>Benefit Corporation</Link></li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className={styles.column}>
                            <h3>Contact Information</h3>
                            <ul>
                                <li>ESG Portal Benefit Corporation</li>
                                <li>Via Ippodromo, 7 - 20151 Milano, Italy</li>
                                <li>Piazza Buenos Aires, 5 - 00198 Roma, Italy</li>
                                <li>VAT IT11344330961</li>
                                <li>R.E.A. MI 2596349</li>
                                <li>Share Capital € 109.335,47</li>
                            </ul>
                        </div>

                        {/* Resources */}
                        <div className={styles.column}>
                            <h3>Resources</h3>
                            <ul>
                                <li><Link to="/login" className={styles.link}>Sign In</Link></li>
                                <li><Link to="/register" className={styles.link}>Sign Up</Link></li>
                                <li><Link to="/privacy" className={styles.link}>Privacy Policy</Link></li>
                                <li><Link to="/cookie" className={styles.link}>Cookie Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className={styles.divider} />

                {/* Bottom Bar */}
                <div className={styles.bottomBar}>
                    <p>Copyright © 2025 - All rights reserved</p>
                    <div className={styles.socials}>
                        <a href="#" className={styles.socialLink}><Twitter size={20} /></a>
                        <a href="#" className={styles.socialLink}><Linkedin size={20} /></a>
                        <a href="#" className={styles.socialLink}><Facebook size={20} /></a>
                        <a href="#" className={styles.socialLink}><Instagram size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
