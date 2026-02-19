import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../shared/components/ui/Button';
import styles from './AuthForm.module.css';

const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

const LoginForm = ({ onSubmit, isLoading }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className={styles.input}
                    {...register('email')}
                />
                {errors.email && <span className={styles.error}>{errors.email.message}</span>}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className={styles.input}
                    {...register('password')}
                />
                {errors.password && <span className={styles.error}>{errors.password.message}</span>}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full mt-4" style={{ borderRadius: '20px', textTransform: 'uppercase', fontWeight: 'bold', backgroundColor: '#000', color: '#fff' }}>
                {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
        </form>
    );
};

export default LoginForm;
