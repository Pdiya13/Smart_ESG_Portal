import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Leaf } from 'lucide-react';
import styles from './Navbar.module.css';

import logo from '../../app/assets/logo.png';

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link to="/" className={styles.brand}>
                    <img src={logo} alt="ESG Portal Logo" className={styles.logoImage} />
                    <span className={styles.logoText}>ESG Portal</span>
                </Link>

                <div className={styles.navLinks}>
                    <Link to="/" className={styles.navLink}>Home</Link>
                    <Link to="/about" className={styles.navLink}>About</Link>
                    <Link to="/features" className={styles.navLink}>Features</Link>
                    <Link to="/rating" className={styles.navLink}>ESG Rating</Link>
                </div>

                <div className={styles.actions}>
                    <Link to="/login">
                        <Button variant="ghost" size="sm">Sign In</Button>
                    </Link>
                    <Link to="/register">
                        <Button size="sm">Get Started</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
