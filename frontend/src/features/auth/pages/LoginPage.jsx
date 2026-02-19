import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import LoginForm from '../components/LoginForm';
import styles from '../components/AuthForm.module.css';
import authService from '../services/authService';
import { useState } from 'react';

const LoginPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (data) => {
        setIsLoading(true);
        try {
            await authService.login(data);
            navigate('/dashboard'); // Redirect to dashboard on success
        } catch (error) {
            console.error("Login failed", error);
            alert("Login failed! Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Welcome Back" subtitle="Sign in to your ESG Portal account">
            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
            <div className={styles.footer}>
                Don't have an account?
                <Link to="/register" className={styles.link}>Sign up</Link>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;
