import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Leaf, Users, Shield, TrendingUp, ArrowRight, Activity, AlertCircle, Target, Calendar } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import { Button } from '../../../shared/components/ui/Button';
import api from '../../../utils/api';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [showDetailedMetrics, setShowDetailedMetrics] = useState(false);

    // Generate last 5 years for the dropdown
    const availableYears = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    useEffect(() => {
        const fetchDashboardData = async () => {
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
                    console.error("Failed to fetch dashboard data:", err);
                    setError(err.response?.data?.message || `Failed to load dashboard data for ${selectedYear}.`);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [selectedYear]);

    // Data aliases
    const displayScore = data?.score;
    const recommendations = data?.recommendations || [];
    // The history list was added to the backend to sync raw DB data to the chart
    const chartData = data?.history || [];
    const metrics = data?.metrics || {};

    const formatMetricName = (key) => {
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
    };

    return (
        <section className={styles.dashboard}>
            {/* 3D Decorative Background Elements */}
            <div className={styles.gridBackground}></div>
            <div className={`${styles.decorativeSphere} ${styles.sphere1}`}></div>
            <div className={`${styles.decorativeSphere} ${styles.sphere2}`}></div>

            <div className={styles.container}>
                {/* GLOBAL DASHBOARD HEADER (Always visible) */}
                <div className={styles.header} style={{ flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={styles.title}
                        >
                            {user?.company?.companyName || 'Company'} Dashboard
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className={styles.subtitle}
                        >
                            Real-time ESG performance and analytics for {selectedYear}.
                        </motion.p>
                    </div>
                    <div className="flex flex-col items-end gap-3 z-20">
                        {/* Year Selector */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 shadow-lg"
                        >
                            <Calendar size={18} className="text-primary" />
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                className="bg-transparent border-none text-gray-800 font-bold outline-none cursor-pointer"
                                style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', paddingRight: '1rem' }}
                            >
                                {availableYears.map(year => (
                                    <option key={year} value={year} className="text-black">{year} Report</option>
                                ))}
                            </select>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 mt-1"
                        >
                            <Link to="/benchmarks">
                                <Button variant="outline" size="sm" className="flex items-center gap-2 border-primary text-primary hover:bg-primary/5">
                                    <Target size={16} />
                                    <span>Set Benchmarks</span>
                                </Button>
                            </Link>
                            <Link to="/submit-esg">
                                <Button variant="outline" size="sm" className="flex items-center gap-2 border-green-500 text-green-600 hover:bg-green-50 z-20 position-relative">
                                    <Leaf size={16} />
                                    <span>Submit Data</span>
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* CONTENT AREA */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh]">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                            <Activity size={48} className="text-primary" />
                        </motion.div>
                        <span className="mt-4 text-primary font-medium text-lg">Loading ESG Insights...</span>
                    </div>
                ) : error || !displayScore ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center bg-white/50 backdrop-blur-xl border border-white rounded-3xl p-10 shadow-2xl relative z-10">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-red-50 p-6 rounded-full border border-red-100 mb-6 shadow-xl shadow-red-500/10"
                        >
                            <AlertCircle size={64} className="text-red-500" />
                        </motion.div>
                        <h2 className="text-3xl font-extrabold mb-3 text-gray-900 drop-shadow-sm">No Data for {selectedYear}</h2>
                        <p className="text-lg text-red-500 font-medium max-w-md mb-2">{error}</p>
                        <p className="text-base text-gray-500 mb-8 max-w-lg">
                            Please select a different year from the dropdown above, or submit your reporting data.
                        </p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {/* Overall Rating Badge */}
                        <div className="col-span-full mb-2">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={styles.badge}
                            >
                                <span className="text-gray-800 font-medium">Overall ESG Rating:</span> <strong className="ml-2 text-2xl text-primary">{displayScore.rating || 'N/A'}</strong>
                            </motion.div>
                        </div>

                        {/* Environment Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className={styles.card}
                        >
                            <div className={styles.cardHeader}>
                                <h3 className={styles.cardTitle}><Leaf className={styles.cardIcon} /> Environment</h3>
                            </div>
                            <div className={styles.scoreValue}>{displayScore.environmentScore ? displayScore.environmentScore.toFixed(1) : '---'}</div>
                            <div className={styles.scoreLabel}>Out of 100 points</div>
                        </motion.div>

                        {/* Social Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className={styles.card}
                        >
                            <div className={styles.cardHeader}>
                                <h3 className={styles.cardTitle}><Users className={styles.cardIcon} /> Social</h3>
                            </div>
                            <div className={styles.scoreValue}>{displayScore.socialScore ? displayScore.socialScore.toFixed(1) : '---'}</div>
                            <div className={styles.scoreLabel}>Out of 100 points</div>
                        </motion.div>

                        {/* Governance Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className={styles.card}
                        >
                            <div className={styles.cardHeader}>
                                <h3 className={styles.cardTitle}><Shield className={styles.cardIcon} /> Governance</h3>
                            </div>
                            <div className={styles.scoreValue}>{displayScore.governanceScore ? displayScore.governanceScore.toFixed(1) : '---'}</div>
                            <div className={styles.scoreLabel}>Out of 100 points</div>
                        </motion.div>

                        {/* Main Chart Card - Graph syncs with database `chartData` */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className={`${styles.card} ${styles.mainChart}`}
                        >
                            <div className={styles.cardHeader}>
                                <h3 className={styles.cardTitle}>ESG Score Progression</h3>
                                {chartData.length > 1 && (
                                    <span className="text-sm text-green-500 font-medium flex items-center gap-1">
                                        <TrendingUp size={16} /> Historical Sync
                                    </span>
                                )}
                            </div>
                            <div className={styles.chartContainer}>
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                            {/* We map database entity field reportingYear and totalEsgScore */}
                                            <XAxis dataKey="reportingYear" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                                itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                                                formatter={(value) => [value.toFixed(2), "ESG Score"]}
                                                labelFormatter={(label) => `Year: ${label}`}
                                            />
                                            <Area type="monotone" dataKey="totalEsgScore" stroke="var(--color-primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-muted-foreground">
                                        Not enough historical data synced from database to generate trends.
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* AI Recommendations Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className={styles.card}
                        >
                            <h3 className={`${styles.cardTitle} mb-4`}>Smart Recommendations</h3>
                            <div className={styles.list}>
                                {recommendations.length > 0 ? (
                                    recommendations.map((rec, index) => (
                                        <motion.div key={index} className={styles.listItem}>
                                            <ArrowRight className={`${styles.listItemIcon} ${rec.type === 'positive' ? styles.positive : styles.negative}`} size={16} />
                                            <span className={styles.listItemText}>{rec.message}</span>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-muted-foreground text-sm italic">
                                        No recommendations available at this time.
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Detailed Metrics Explanation View (Requested by User) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className={styles.metricsSection}
                        >
                            <div className={styles.metricsToggleContainer}>
                                <button
                                    onClick={() => setShowDetailedMetrics(!showDetailedMetrics)}
                                    className={styles.metricsToggleBtn}
                                >
                                    {showDetailedMetrics ? 'Hide Detailed Metrics' : 'View Detailed Metrics Breakdown'}
                                    <motion.div
                                        animate={{ rotate: showDetailedMetrics ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </motion.div>
                                </button>
                            </div>

                            {/* Expandable Content Area */}
                            {showDetailedMetrics && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className={styles.metricsContainer}
                                >
                                    <h3 className={styles.metricsHeader}>
                                        <Activity size={24} className="text-primary" />
                                        Detailed Metric Explanation for {selectedYear}
                                        <span className="text-sm font-normal text-gray-500 ml-4">Synced with Database Records</span>
                                    </h3>

                                    <div className={styles.metricsGrid}>

                                        {/* Env Details */}
                                        <div className={`${styles.pillarCard} ${styles.pillarCardEnv}`}>
                                            <h4 className={styles.pillarCardTitle}>
                                                <Leaf size={20} className={styles.cardIcon} /> Environment Details
                                            </h4>
                                            <div>
                                                <div className={`${styles.metricRow} ${styles.metricTotalRow}`}>
                                                    <span className={styles.metricName}>Total Pillar Score</span>
                                                    <span className={styles.metricValue}>{displayScore.environmentScore?.toFixed(2)}</span>
                                                </div>
                                                {metrics.environmentMetrics ? Object.entries(metrics.environmentMetrics).map(([key, value]) => {
                                                    if (key === 'id' || key === 'companyId') return null;
                                                    return (
                                                        <div key={key} className={styles.metricRow}>
                                                            <span className={styles.metricName}>{formatMetricName(key)}</span>
                                                            <span className={styles.metricValue}>{typeof value === 'number' ? value.toFixed(2) : String(value)}</span>
                                                        </div>
                                                    )
                                                }) : <p className={styles.emptyMetrics}>Database metrics unavailable.</p>}
                                            </div>
                                        </div>

                                        {/* Soc Details */}
                                        <div className={`${styles.pillarCard} ${styles.pillarCardSoc}`}>
                                            <h4 className={styles.pillarCardTitle}>
                                                <Users size={20} className={styles.cardIcon} /> Social Details
                                            </h4>
                                            <div>
                                                <div className={`${styles.metricRow} ${styles.metricTotalRow}`}>
                                                    <span className={styles.metricName}>Total Pillar Score</span>
                                                    <span className={styles.metricValue}>{displayScore.socialScore?.toFixed(2)}</span>
                                                </div>
                                                {metrics.socialMetrics ? Object.entries(metrics.socialMetrics).map(([key, value]) => {
                                                    if (key === 'id' || key === 'companyId') return null;
                                                    return (
                                                        <div key={key} className={styles.metricRow}>
                                                            <span className={styles.metricName}>{formatMetricName(key)}</span>
                                                            <span className={styles.metricValue}>{typeof value === 'number' ? value.toFixed(2) : String(value)}</span>
                                                        </div>
                                                    )
                                                }) : <p className={styles.emptyMetrics}>Database metrics unavailable.</p>}
                                            </div>
                                        </div>

                                        {/* Gov Details */}
                                        <div className={`${styles.pillarCard} ${styles.pillarCardGov}`}>
                                            <h4 className={styles.pillarCardTitle}>
                                                <Shield size={20} className={styles.cardIcon} /> Governance Details
                                            </h4>
                                            <div>
                                                <div className={`${styles.metricRow} ${styles.metricTotalRow}`}>
                                                    <span className={styles.metricName}>Total Pillar Score</span>
                                                    <span className={styles.metricValue}>{displayScore.governanceScore?.toFixed(2)}</span>
                                                </div>
                                                {metrics.governanceMetrics ? Object.entries(metrics.governanceMetrics).map(([key, value]) => {
                                                    if (key === 'id' || key === 'companyId') return null;
                                                    return (
                                                        <div key={key} className={styles.metricRow}>
                                                            <span className={styles.metricName}>{formatMetricName(key)}</span>
                                                            <span className={styles.metricValue}>{typeof value === 'number' ? value.toFixed(2) : String(value)}</span>
                                                        </div>
                                                    )
                                                }) : <p className={styles.emptyMetrics}>Database metrics unavailable.</p>}
                                            </div>
                                        </div>

                                    </div>
                                </motion.div>
                            )}
                        </motion.div>

                    </div>
                )}
            </div>
        </section>
    );
};

export default DashboardPage;
