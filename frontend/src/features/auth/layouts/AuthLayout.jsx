import styles from './AuthLayout.module.css';
import loginVideo from '../../../app/assets/Login.mp4';
import logo from '../../../app/assets/logo.png';
import { motion } from 'framer-motion';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className={styles.container}>
            <video
                autoPlay
                loop
                muted
                playsInline
                className={styles.videoBackground}
            >
                <source src={loginVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className={styles.overlay}></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={styles.card}
            >
                <div className={styles.header}>
                    <img src={logo} alt="ESG Portal" className={styles.logo} />
                    <h2 className={styles.title}>{title}</h2>
                    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                </div>
                {children}
            </motion.div>
        </div>
    );
};

export default AuthLayout;
