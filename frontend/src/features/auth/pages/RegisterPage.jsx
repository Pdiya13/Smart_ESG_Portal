import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import RegisterForm from '../components/RegisterForm';
import styles from '../components/AuthForm.module.css';
import authService from '../services/authService';
import { useState } from 'react';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (data) => {
        setIsLoading(true);
        try {
            await authService.signup(data);
            navigate('/dashboard'); // Redirect to dashboard on success
        } catch (error) {
            console.error("Registration failed", error);
            alert("Registration failed! Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Create Account" subtitle="Start your sustainability journey today">
            <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
            <div className={styles.footer}>
                Already have an account?
                <Link to="/login" className={styles.link}>Sign in</Link>
            </div>
        </AuthLayout>
    );
};

export default RegisterPage;
