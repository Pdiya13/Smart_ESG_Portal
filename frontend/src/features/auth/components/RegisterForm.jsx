import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../shared/components/ui/Button';
import styles from './AuthForm.module.css';

// CIN Regex: [A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}
const cinRegex = /^[A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

const registerSchema = z.object({
    companyName: z.string().min(1, 'Company Name is required'),
    cin: z.string()
        .length(21, 'CIN must be exactly 21 characters')
        .regex(cinRegex, 'Invalid CIN format. Example: U12345MH2024PTC123456'),
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const RegisterForm = ({ onSubmit, isLoading }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.formGroup}>
                <label htmlFor="companyName" className={styles.label}>Company Name</label>
                <input
                    id="companyName"
                    type="text"
                    placeholder="Acme Corp"
                    className={styles.input}
                    {...register('companyName')}
                />
                {errors.companyName && <span className={styles.error}>{errors.companyName.message}</span>}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="cin" className={styles.label}>CIN</label>
                <input
                    id="cin"
                    type="text"
                    placeholder="U12345MH2024PTC123456"
                    className={styles.input}
                    {...register('cin')}
                />
                {errors.cin && <span className={styles.error}>{errors.cin.message}</span>}
            </div>

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
                {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
        </form>
    );
};

export default RegisterForm;
