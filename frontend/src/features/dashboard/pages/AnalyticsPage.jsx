import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Lightbulb, ArrowUpRight, ArrowDownRight, Minus, Activity, AlertCircle } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import api from '../../../utils/api';
import styles from './AnalyticsPage.module.css';

const AnalyticsPage = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Generate a wider range of years to fix the bug where future years (e.g. 2027) can't be selected
    const currentYear = new Date().getFullYear();
    const availableYears = Array.from({ length: 9 }, (_, i) => currentYear - 4 + i).reverse();

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            setLoading(true);
            setError(null);
            setData(null);
            try {
                const response = await api.get(`/report/reports/dashboard/${selectedYear}`);
                // API Gateway/Report Service wraps responses in an ApiResponse object
                setData(response.data.data);
            } catch (err) {
                if (err.response?.status === 404) {
                    setError(`No ESG data found for ${selectedYear}.`);
                } else {
                    console.error("Failed to fetch analytics data:", err);
                    setError(err.response?.data?.message || `Failed to load analytics data for ${selectedYear}.`);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, [selectedYear]);

    // Data aliases
    const recommendations = data?.recommendations || [];
    const trends = data?.trends || [];

    return (
        <section className={styles.dashboard}>
            {/* 3D Decorative Background Elements */}
            <div className={styles.gridBackground}></div>
            <div className={`${styles.decorativeSphere} ${styles.sphere1}`}></div>
            <div className={`${styles.decorativeSphere} ${styles.sphere2}`}></div>

            <div className={styles.container}>
                {/* GLOBAL HEADER */}
                <div className={styles.header}>
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={styles.title}
                        >
                            AI Analytics & Insights
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className={styles.subtitle}
                        >
                            Deep dive into trends and recommendations for {user?.company?.companyName || 'your company'}.
                        </motion.p>
                    </div>
                </div>

                {/* Interactive Year Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={styles.yearSelectorBlock}
                >
                    <h3 className={styles.yearSelectorTitle}><Calendar size={20} className="text-primary" /> Select Year to View Data</h3>
                    <div className={styles.yearChips}>
                        {availableYears.map(year => (
                            <button
                                key={year}
                                onClick={() => setSelectedYear(year)}
                                className={`${styles.yearChip} ${selectedYear === year ? styles.active : ''}`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                            <Activity size={48} className="text-primary" />
                        </motion.div>
                        <span className="mt-4 text-primary font-medium">Loading Insights...</span>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white/50 backdrop-blur-xl border border-white rounded-3xl p-8 shadow-2xl relative z-10 w-full">
                        <AlertCircle size={48} className="text-red-500 mb-4" />
                        <h2 className="text-2xl font-bold mb-2 text-gray-900">No Insights for {selectedYear}</h2>
                        <p className="text-sm text-red-500 mb-6">{error}</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        
                        {/* Trends Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className={styles.card}
                        >
                            <div className={styles.cardHeader}>
                                <h3 className={styles.cardTitle}><TrendingUp className={styles.cardIcon} style={{ color: '#3b82f6' }}/> Analytic Trends</h3>
                            </div>
                            {trends.length > 0 ? (
                                <div className={styles.list}>
                                    {trends.map((trend, index) => (
                                        <div key={index} className={`${styles.listItem} ${styles.trendItem}`}>
                                            <div className={`${styles.trendIconWrapper} ${trend.direction === 'UP' ? styles.trendIconUp : trend.direction === 'DOWN' ? styles.trendIconDown : styles.trendIconStable}`}>
                                                {trend.direction === 'UP' ? <ArrowUpRight size={24} /> : 
                                                 trend.direction === 'DOWN' ? <ArrowDownRight size={24} /> : 
                                                 <Minus size={24} />}
                                            </div>
                                            <div className={styles.trendContent}>
                                                <span className={styles.trendYear}>Comparing {trend.previousYear} to {trend.currentYear}</span>
                                                <div className={styles.trendDetails}>
                                                    <span className={styles.trendMessage}>Performance {trend.direction.toLowerCase() === 'up' ? 'improved' : trend.direction.toLowerCase() === 'down' ? 'declined' : 'remained stable'}</span>
                                                    {trend.growthPercent !== null && trend.growthPercent !== undefined && (
                                                        <span className={`${styles.trendPercent} ${trend.direction === 'UP' ? styles.positivePercent : trend.direction === 'DOWN' ? styles.negativePercent : styles.stablePercent}`}>
                                                            {trend.direction === 'UP' ? '+' : trend.direction === 'DOWN' ? '' : ''}{Math.abs(trend.growthPercent).toFixed(1)}%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm italic">Not enough historical data to generate trend analytics.</p>
                            )}
                        </motion.div>

                        {/* Recommendations Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className={styles.card}
                        >
                            <div className={styles.cardHeader}>
                                <h3 className={styles.cardTitle}><Lightbulb className={styles.cardIcon} style={{ color: '#eab308' }}/> Smart Recommendations</h3>
                            </div>
                            {recommendations.length > 0 ? (
                                <div className={styles.list}>
                                    {recommendations.map((rec, index) => (
                                        <div key={index} className={`${styles.listItem} ${styles.recItem}`}>
                                            <div className={styles.recIconWrapper}>
                                                <Lightbulb size={18} className="text-yellow-600" />
                                            </div>
                                            <div className={styles.recContent}>
                                                <span className={styles.recText}>{rec.message}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm italic">No actionable recommendations available at this time.</p>
                            )}
                        </motion.div>

                    </div>
                )}
            </div>
        </section>
    );
};

export default AnalyticsPage;
