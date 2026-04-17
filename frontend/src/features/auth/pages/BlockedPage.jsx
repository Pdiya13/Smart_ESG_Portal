import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldX, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './BlockedPage.module.css';

const BlockedPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className={styles.blockedPage}>
            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    <ShieldX size={40} color="#dc2626" />
                </div>
                <h1 className={styles.title}>Account Disabled</h1>
                <p className={styles.message}>
                    Your company <strong>{user?.companyName || 'account'}</strong> has been{' '}
                    <strong>disabled by the administrator</strong>.
                </p>
                <p className={styles.message}>
                    You are not permitted to use the ESG Portal features at this time.
                </p>
                <p className={styles.subtext}>
                    If you think this is a mistake, please contact the portal administrator for assistance.
                </p>
                <button className={styles.logoutBtn} onClick={handleLogout}>
                    <LogOut size={18} />
                    Back to Login
                </button>
            </div>
        </div>
    );
};

export default BlockedPage;
