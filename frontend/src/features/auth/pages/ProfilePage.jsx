import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Mail, Loader2, CheckCircle2, AlertCircle, Save, Edit3, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
    const { user, updateUser } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
    });
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                companyName: user.companyName || '',
                email: user.email || '',
            });
        }
    }, [user, isEditing]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            await updateUser(formData);
            setSuccessMsg('Profile updated successfully!');
            setIsEditing(false);
            setTimeout(() => setSuccessMsg(''), 4000);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || err.message || 'Failed to update profile.');
            setTimeout(() => setErrorMsg(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
    };

    return (
        <section className={styles.page}>
            {/* Background Animations */}
            <div className={styles.gridBackground}></div>
            <div className={`${styles.decorativeSphere} ${styles.sphere1}`}></div>
            <div className={`${styles.decorativeSphere} ${styles.sphere2}`}></div>

            <motion.div
                className={styles.container}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className={styles.header}>
                    <motion.div variants={itemVariants} className={styles.avatarContainer}>
                        <div className={styles.avatarGlow}></div>
                        <div className={styles.avatar}>
                            {(user?.companyName || user?.email || 'C').charAt(0).toUpperCase()}
                        </div>
                    </motion.div>

                    <motion.h1 variants={itemVariants} className={styles.title}>
                        Company Profile
                    </motion.h1>
                    <motion.p variants={itemVariants} className={styles.subtitle}>
                        Manage your ESG portal identity and contact details.
                    </motion.p>
                </div>

                <AnimatePresence mode="wait">
                    {successMsg && !isEditing && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            className={styles.alertSuccess}
                            style={{ margin: '0 auto', width: '100%', maxWidth: '540px' }}
                        >
                            <CheckCircle2 size={18} /> {successMsg}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div variants={itemVariants} className={styles.formCard}>
                    <div className={styles.cardHeader}>
                        <h2>Details</h2>
                        <div className={styles.readOnlyBadge}>
                            CIN: {user?.cin || 'N/A'}
                        </div>
                    </div>

                    {!isEditing ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={styles.viewMode}
                        >
                            <div className={styles.detailRow}>
                                <div className={styles.detailLabel}><Building2 size={16} /> Company Name</div>
                                <div className={styles.detailValue}>{user?.companyName || 'Not Provided'}</div>
                            </div>
                            <div className={styles.detailRow}>
                                <div className={styles.detailLabel}><Mail size={16} /> Email Address</div>
                                <div className={styles.detailValue}>{user?.email || 'Not Provided'}</div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsEditing(true)}
                                className={styles.editBtn}
                            >
                                <Edit3 size={18} /> Update Profile
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onSubmit={handleSubmit}
                            className={styles.form}
                        >
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Company Name</label>
                                <div className={styles.inputWrapper}>
                                    <Building2 size={18} className={styles.inputIcon} />
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        className={styles.input}
                                        placeholder="Enter company name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Email Address</label>
                                <div className={styles.inputWrapper}>
                                    <Mail size={18} className={styles.inputIcon} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={styles.input}
                                        placeholder="Enter contact email"
                                        required
                                    />
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {errorMsg && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                        animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                        className={styles.alertError}
                                    >
                                        <AlertCircle size={18} /> {errorMsg}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className={styles.actionButtons}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className={styles.cancelBtn}
                                    disabled={loading}
                                >
                                    <X size={18} /> Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className={styles.submitBtn}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className={styles.spin} size={20} />
                                    ) : (
                                        <>
                                            <Save size={18} /> Save Changes
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.form>
                    )}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default ProfilePage;
