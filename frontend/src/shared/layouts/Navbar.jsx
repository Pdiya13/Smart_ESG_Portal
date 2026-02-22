import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Leaf, LogOut, LayoutDashboard, Target } from 'lucide-react';
import { useAuth } from '../../features/auth/context/AuthContext';
import styles from './Navbar.module.css';

import logo from '../../app/assets/logo.png';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };
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
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-700 hidden md:block">
                                {user.companyName || user.email}
                            </span>
                            <Link to="/dashboard">
                                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                    <LayoutDashboard size={16} />
                                    <span className="hidden sm:inline">Dashboard</span>
                                </Button>
                            </Link>
                            <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
                                <LogOut size={16} />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" size="sm">Sign In</Button>
                            </Link>
                            <Link to="/register">
                                <Button size="sm">Get Started</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
