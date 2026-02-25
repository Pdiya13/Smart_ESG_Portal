import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    const [expandedCard, setExpandedCard] = useState(null);

    // Generate a wider range of years to fix the bug where future years (e.g. 2027) can't be selected
    const currentYear = new Date().getFullYear();
    const availableYears = Array.from({ length: 9 }, (_, i) => currentYear - 4 + i).reverse();

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

    const toggleCard = (cardName) => {
        if (expandedCard === cardName) {
            setExpandedCard(null);
        } else {
            setExpandedCard(cardName);
        }
    };

    const renderMetricsContent = (pillarName, metricsData, totalScore, iconClass, valueClass) => {
        return (
            <AnimatePresence>
                {expandedCard === pillarName && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={styles.detailsContainer}
                    >
                        <div className={`${styles.metricRow} ${styles.metricTotalRow} ${styles[iconClass]}`}>
                            <span className={styles.metricName}>Total Pillar Score</span>
                            <span className={`${styles.metricValue} ${styles[valueClass]}`}>{totalScore?.toFixed(2) || 'N/A'}</span>
                        </div>
                        {metricsData ? Object.entries(metricsData).map(([key, value]) => {
                            // Hide internal ID fields and timestamps
                            const hiddenKeys = ['id', 'companyId', 'reportingYear', 'metricId', 'environmentId', 'socialId', 'governanceId', 'calculatedAt'];
                            if (hiddenKeys.includes(key)) return null;

                            return (
                                <div key={key} className={styles.metricRow}>
                                    <span className={styles.metricName}>{formatMetricName(key)}</span>
                                    <span className={styles.metricValue}>{typeof value === 'number' ? value.toFixed(2) : String(value)}</span>
                                </div>
                            )
                        }) : <p className={styles.emptyMetrics}>Database metrics unavailable.</p>}
                    </motion.div>
                )}
            </AnimatePresence>
        );
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
                        <div className="flex items-center gap-3 z-20">
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
                        </div>
                    </div>
                </div>

                {/* TWO COLUMN GRID LAYOUT */}
                <div className={styles.grid}>

                    {/* LEFT COLUMN: Chart + Year Selector */}
                    <div className={styles.leftColumn}>

                        {/* Main Chart Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className={styles.card}
                        >
                            <div className={styles.cardHeader}>
                                <h3 className={styles.cardTitle}>ESG Score Progression</h3>
                                {chartData.length > 1 && (
                                    <span className="text-sm text-green-500 font-medium flex items-center gap-1">
                                        <TrendingUp size={16} /> Historical Sync
                                    </span>
                                )}
                            </div>
                            <div className={styles.chartContainer} style={{ width: '100%', height: '300px' }}>
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

                        {/* Interactive Year Selector */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
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

                    </div>

                    {/* RIGHT COLUMN: Pillar Scores and Total Rating */}
                    <div className={styles.rightColumn}>
                        {loading ? (
                            <div className="flex flex-col items-center justify-center min-h-[400px]">
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                                    <Activity size={48} className="text-primary" />
                                </motion.div>
                                <span className="mt-4 text-primary font-medium">Loading Data...</span>
                            </div>
                        ) : error || !displayScore ? (
                            <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white/50 backdrop-blur-xl border border-white rounded-3xl p-8 shadow-2xl relative z-10 w-full h-full">
                                <AlertCircle size={48} className="text-red-500 mb-4" />
                                <h2 className="text-2xl font-bold mb-2 text-gray-900">No Data for {selectedYear}</h2>
                                <p className="text-sm text-red-500 mb-6">{error}</p>
                            </div>
                        ) : (
                            <>
                                {/* Environment Card */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className={`${styles.card} ${expandedCard === 'env' ? styles.pillarCardEnv : ''}`}
                                >
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.cardTitle}><Leaf className={styles.cardIcon} /> Environment Score</h3>
                                    </div>
                                    <div className={styles.scoreValue} style={{ color: expandedCard === 'env' ? '#15803d' : 'inherit' }}>
                                        {displayScore.environmentScore ? displayScore.environmentScore.toFixed(1) : '---'}
                                    </div>
                                    <button className={styles.expandButton} onClick={() => toggleCard('env')}>
                                        {expandedCard === 'env' ? (
                                            <>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg> Hide Details
                                            </>
                                        ) : (
                                            <>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg> View Details
                                            </>
                                        )}
                                    </button>
                                    {renderMetricsContent('env', metrics.environmentMetrics, displayScore.environmentScore, 'pillarCardEnv', 'pillarCardEnv')}
                                </motion.div>

                                {/* Social Card */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className={`${styles.card} ${expandedCard === 'soc' ? styles.pillarCardSoc : ''}`}
                                >
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.cardTitle}><Users className={styles.cardIcon} /> Social Score</h3>
                                    </div>
                                    <div className={styles.scoreValue} style={{ color: expandedCard === 'soc' ? '#1d4ed8' : 'inherit' }}>
                                        {displayScore.socialScore ? displayScore.socialScore.toFixed(1) : '---'}
                                    </div>
                                    <button className={styles.expandButton} onClick={() => toggleCard('soc')}>
                                        {expandedCard === 'soc' ? (
                                            <>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg> Hide Details
                                            </>
                                        ) : (
                                            <>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg> View Details
                                            </>
                                        )}
                                    </button>
                                    {renderMetricsContent('soc', metrics.socialMetrics, displayScore.socialScore, 'pillarCardSoc', 'pillarCardSoc')}
                                </motion.div>

                                {/* Governance Card */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className={`${styles.card} ${expandedCard === 'gov' ? styles.pillarCardGov : ''}`}
                                >
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.cardTitle}><Shield className={styles.cardIcon} /> Governance Score</h3>
                                    </div>
                                    <div className={styles.scoreValue} style={{ color: expandedCard === 'gov' ? '#7e22ce' : 'inherit' }}>
                                        {displayScore.governanceScore ? displayScore.governanceScore.toFixed(1) : '---'}
                                    </div>
                                    <button className={styles.expandButton} onClick={() => toggleCard('gov')}>
                                        {expandedCard === 'gov' ? (
                                            <>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg> Hide Details
                                            </>
                                        ) : (
                                            <>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg> View Details
                                            </>
                                        )}
                                    </button>
                                    {renderMetricsContent('gov', metrics.governanceMetrics, displayScore.governanceScore, 'pillarCardGov', 'pillarCardGov')}
                                </motion.div>

                                {/* Total Rating Card */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className={styles.card}
                                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))', border: '1px solid var(--color-primary)' }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">Total Rating</h3>
                                            <p className="text-sm text-gray-500">Overall ESG Performance</p>
                                        </div>
                                        <div className="text-5xl font-black text-primary">
                                            {displayScore.rating || 'N/A'}
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DashboardPage;
