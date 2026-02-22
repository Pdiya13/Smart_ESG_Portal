import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import styles from './AuthPage.module.css';

const AuthPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { login, signup } = useAuth(); // Use context methods
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (location.pathname === '/register') {
            setIsSignUp(true);
        } else {
            setIsSignUp(false);
        }
    }, [location.pathname]);

    const handleToggle = () => {
        setIsSignUp(!isSignUp);
        // Build URL based on state toggle
        navigate(isSignUp ? '/login' : '/register');
    };

    const handleLogin = async (data) => {
        setIsLoading(true);
        try {
            await login(data);
            navigate('/dashboard');
        } catch (error) {
            console.error("Login failed", error);
            alert("Login failed! Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (data) => {
        setIsLoading(true);
        try {
            await signup(data);
            navigate('/dashboard');
        } catch (error) {
            console.error("Registration failed", error);
            alert("Registration failed! Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <Link to="/" className={styles.backButton}>
                <Home size={24} />
                <span>Back to Home</span>
            </Link>
            <div className={`${styles.container} ${isSignUp ? styles.active : ''}`}>

                {/* Sign Up Container */}
                <div className={`${styles.formContainer} ${styles.signUp}`}>
                    <div className={styles.formContent}>
                        <h1 className={styles.title}>Create Account</h1>
                        {/* Social Icons could go here */}
                        <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
                    </div>
                </div>

                {/* Sign In Container */}
                <div className={`${styles.formContainer} ${styles.signIn}`}>
                    <div className={styles.formContent}>
                        <h1 className={styles.title}>Sign In</h1>
                        {/* Social Icons could go here */}
                        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
                    </div>
                </div>

                {/* Overlay Container */}
                <div className={styles.toggleContainer}>
                    <div className={styles.toggle}>
                        <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
                            <h1 className={styles.title} style={{ color: 'white' }}>Welcome Back!</h1>
                            <p className={styles.togglePara}>To keep connected with us please login with your personal info</p>
                            <button className={styles.ghostBtn} onClick={handleToggle}>Sign In</button>
                        </div>
                        <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
                            <h1 className={styles.title} style={{ color: 'white' }}>Hello, Friend!</h1>
                            <p className={styles.togglePara}>Enter your personal details and start journey with us</p>
                            <button className={styles.ghostBtn} onClick={handleToggle}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
