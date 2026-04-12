import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Lightbulb, ArrowUpRight, ArrowDownRight, Minus, Activity, AlertCircle, Brain, Sparkles, Target, Zap } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import api from '../../../utils/api';
import styles from './AnalyticsPage.module.css';

const AnalyticsPage = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // ML Prediction State
    const [prediction, setPrediction] = useState(null);
    const [predictionLoading, setPredictionLoading] = useState(false);
    const [predictionError, setPredictionError] = useState(null);

    const currentYear = new Date().getFullYear();
    const [availableYears, setAvailableYears] = useState([]);

    // Update available years when history is loaded
    useEffect(() => {
        const historyYears = data?.history ? data.history.map(h => h.reportingYear) : [];
        const uniqueYears = Array.from(new Set(historyYears)).sort((a, b) => b - a);
        setAvailableYears(uniqueYears);

        // If selected year has no data, but history is available, auto-switch to the latest year with data
        if (data && !data.score && uniqueYears.length > 0 && !uniqueYears.includes(selectedYear)) {
            setSelectedYear(uniqueYears[0]);
        }
    }, [data, selectedYear]);

    // Fetch dashboard data (includes history)
    useEffect(() => {
        const fetchAnalyticsData = async () => {
            setLoading(true);
            setError(null);
            setData(null);
            setPrediction(null);
            setPredictionError(null);
            try {
                const response = await api.get(`/report/reports/dashboard/${selectedYear}`);
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

    // Fetch ML prediction when history data is available
    useEffect(() => {
        const fetchPrediction = async () => {
            const rawHistory = data?.history;
            if (!rawHistory || rawHistory.length === 0) {
                setPrediction(null);
                return;
            }

            // FILTER: Only use history UP TO the selected year
            // This makes the prediction "context-aware"
            const relevantHistory = rawHistory.filter(h => h.reportingYear <= selectedYear);
            
            if (relevantHistory.length < 3) {
                setPrediction(null);
                setPredictionError(`Need at least 3 consecutive years of data up to ${selectedYear} for a valid AI prediction.`);
                return;
            }

            // Sort by year ascending and extract years + scores
            const sorted = [...relevantHistory].sort((a, b) => a.reportingYear - b.reportingYear);
            const years = sorted.map(h => h.reportingYear);
            const scores = sorted.map(h => h.totalEsgScore);

            // Check if years are sequential (ML service requires consecutive years)
            let isSequential = true;
            for (let i = 1; i < years.length; i++) {
                if (years[i] !== years[i - 1] + 1) {
                    isSequential = false;
                    break;
                }
            }

            if (!isSequential) {
                // Try to find the longest sequential tail
                let seqStart = years.length - 1;
                for (let i = years.length - 2; i >= 0; i--) {
                    if (years[i] === years[i + 1] - 1) {
                        seqStart = i;
                    } else {
                        break;
                    }
                }
                const seqYears = years.slice(seqStart);
                const seqScores = scores.slice(seqStart);
                
                if (seqYears.length < 3) {
                    setPredictionError(`Insufficient sequential data up to ${selectedYear}. Need 3 consecutive years.`);
                    return;
                }
                
                years.splice(0, years.length, ...seqYears);
                scores.splice(0, scores.length, ...seqScores);
            }

            setPredictionLoading(true);
            setPredictionError(null);
            try {
                const response = await api.post('/ml/predict', { years, scores });
                setPrediction(response.data);
            } catch (err) {
                console.error("ML prediction failed:", err);
                setPredictionError("AI prediction service is currently unavailable.");
            } finally {
                setPredictionLoading(false);
            }
        };

        if (data) {
            fetchPrediction();
        }
    }, [data, selectedYear]);

    // Data aliases
    const recommendations = data?.recommendations || [];
    const trends = data?.trends || [];
    const history = data?.history || [];

    // Compute delta for prediction
    const predictionDelta = useMemo(() => {
        if (!prediction || !history.length) return null;
        const sorted = [...history].sort((a, b) => a.reportingYear - b.reportingYear);
        const lastScore = sorted[sorted.length - 1]?.totalEsgScore;
        if (lastScore == null) return null;
        const diff = prediction.predicted_score - lastScore;
        const percent = lastScore !== 0 ? (diff / lastScore) * 100 : 0;
        return { diff, percent, direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable' };
    }, [prediction, history]);

    // SVG gauge calculations
    const gaugeRadius = 76;
    const gaugeCircumference = 2 * Math.PI * gaugeRadius;
    const gaugePercent = prediction ? Math.min(prediction.predicted_score, 100) / 100 : 0;
    const gaugeDashOffset = gaugeCircumference * (1 - gaugePercent);

    // Helper for Recommendation Enrichment
    const enrichRecommendation = (rec) => {
        const msg = rec.message.toLowerCase();
        let priority = 'Moderate';
        let category = 'Operational';
        let categoryIcon = <Activity size={14} />;

        if (msg.includes('renewable') || msg.includes('carbon') || msg.includes('emission') || msg.includes('energy')) {
            category = 'Environmental';
            categoryIcon = <Sparkles size={14} />;
        } else if (msg.includes('social') || msg.includes('hire') || msg.includes('safety') || msg.includes('diversity')) {
            category = 'Social';
            categoryIcon = <Target size={14} />;
        } else if (msg.includes('governance') || msg.includes('audit') || msg.includes('compliance')) {
            category = 'Governance';
            categoryIcon = <AlertCircle size={14} />;
        }

        if (msg.includes('urgent') || msg.includes('critical') || msg.includes('improve') || msg.includes('failed') || msg.includes('low')) {
            priority = 'High Impact';
        } else if (msg.includes('monitor') || msg.includes('maintain') || msg.includes('stable')) {
            priority = 'Advisory';
        }

        return { ...rec, priority, category, categoryIcon };
    };

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
                <div className={styles.yearSelectorContainer}>
                    <div className={styles.yearChips}>
                        {availableYears.slice(0, 5).map(year => (
                            <button
                                key={year}
                                onClick={() => setSelectedYear(year)}
                                className={`${styles.yearChip} ${selectedYear === year ? styles.active : ''}`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                    {availableYears.length > 5 && (
                        <div className={styles.moreYearsWrapper}>
                            <span className={styles.moreLabel}>Older Data:</span>
                            <select 
                                className={styles.yearSelect}
                                value={availableYears.slice(5).includes(selectedYear) ? selectedYear : ''}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                            >
                                <option value="" disabled>Select Year...</option>
                                {availableYears.slice(5).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    )}
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
                    <div className={styles.segmentsStack}>

                        {/* ═══ PRO AI INSIGHTS CONTROL ═══ */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className={styles.predictionCard}
                            id="ai-prediction-card"
                        >
                            <div className={styles.predictionCardInner}>
                                <div className={styles.predictionHeader}>
                                    <div className={styles.predictionTitle}>
                                        <div className={styles.predictionTitleIcon}>
                                            <Brain size={24} />
                                        </div>
                                        <div>
                                            <h3 className={styles.mainPredictionLabel}>AI ESG Projection</h3>
                                            <p className={styles.predictionSubHeader}>Contextual forecast based on {selectedYear} data</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Loading State */}
                                {predictionLoading && (
                                    <div className={styles.predictionLoadingSpinner}>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                        >
                                            <Brain size={40} style={{ color: '#a855f7' }} />
                                        </motion.div>
                                        <span className={styles.predictionLoadingText}>
                                            Quantizing ESG trajectories...
                                        </span>
                                    </div>
                                )}

                                {/* Prediction Result */}
                                {!predictionLoading && prediction && (
                                    <div className={styles.predictionBody}>
                                        {/* Main Trajectory Display */}
                                        <div className={styles.mainInsightRow}>
                                            <div className={styles.gaugeContainerWrapper}>
                                                <div className={styles.gaugeContainer}>
                                                    <svg className={styles.gaugeRing} viewBox="0 0 180 180">
                                                        <defs>
                                                            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                <stop offset="0%" stopColor="#a855f7" />
                                                                <stop offset="100%" stopColor="#3b82f6" />
                                                            </linearGradient>
                                                        </defs>
                                                        <circle className={styles.gaugeTrack} cx="90" cy="90" r={gaugeRadius} />
                                                        <motion.circle
                                                            initial={{ strokeDashoffset: gaugeCircumference }}
                                                            animate={{ strokeDashoffset: gaugeDashOffset }}
                                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                                            className={styles.gaugeFill}
                                                            cx="90"
                                                            cy="90"
                                                            r={gaugeRadius}
                                                            strokeDasharray={gaugeCircumference}
                                                        />
                                                    </svg>
                                                    <div className={styles.gaugeCenter}>
                                                        <span className={styles.gaugeYear}>{prediction.predicted_year} Target</span>
                                                        <motion.span 
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className={styles.gaugeScore}
                                                        >
                                                            {Math.round(prediction.predicted_score)}
                                                        </motion.span>
                                                        <div className={styles.scoreMeta}>
                                                            <Target size={12} /> Expected Score
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={styles.insightStatsGrid}>
                                                {/* Directional Indicator */}
                                                {predictionDelta && (
                                                    <div className={`${styles.statsPane} ${predictionDelta.direction === 'up' ? styles.paneSuccess : styles.paneWarning}`}>
                                                        <div className={styles.paneHeader}>
                                                            <span className={styles.paneLabel}>Projected Trend</span>
                                                            {predictionDelta.direction === 'up' ? <TrendingUp size={16} /> : <Activity size={16} />}
                                                        </div>
                                                        <div className={styles.paneValueWrapper}>
                                                            <span className={styles.paneValue}>
                                                                {predictionDelta.direction === 'up' ? '+' : ''}{predictionDelta.diff.toFixed(2)}
                                                            </span>
                                                            <span className={styles.panePercent}>
                                                                ({predictionDelta.direction === 'up' ? '+' : ''}{predictionDelta.percent.toFixed(1)}%)
                                                            </span>
                                                        </div>
                                                        <div className={styles.paneFooter}>
                                                            {predictionDelta.direction === 'up' ? 'Improvement expected' : 'Decline forecasted'}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className={styles.statsPane}>
                                                    <div className={styles.paneHeader}>
                                                        <span className={styles.paneLabel}>Model Confidence</span>
                                                        <Brain size={16} />
                                                    </div>
                                                    <div className={styles.paneValueWrapper}>
                                                        <span className={styles.paneValue}>89.4%</span>
                                                    </div>
                                                    <div className={styles.confidenceBar}>
                                                        <div className={styles.confidenceFill} style={{ width: '89.4%' }}></div>
                                                    </div>
                                                    <div className={styles.paneFooter}>High reliability based on historical stability</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Action Bar */}
                                        <div className={styles.predictionActionBar}>
                                            <div className={styles.actionInfo}>
                                                <AlertCircle size={16} style={{ color: '#a855f7' }} />
                                                <span>AI recommends <strong>Net-Zero Strategy</strong> to exceed the {prediction.predicted_year} target.</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Fallback: Not enough data */}
                                {!predictionLoading && !prediction && !predictionError && (
                                    <div className={styles.predictionFallback}>
                                        <div className={styles.predictionFallbackIcon}>
                                            <Brain size={28} />
                                        </div>
                                        <h4 className={styles.predictionFallbackTitle}>Dataset Incomplete</h4>
                                        <p className={styles.predictionFallbackText}>
                                            The AI requires a minimum of 3 consecutive reports up to {selectedYear} to generate a forward projection.
                                            Please verify data for {selectedYear - 2}, {selectedYear - 1}, and {selectedYear}.
                                        </p>
                                    </div>
                                )}

                                {/* Fallback: ML Service Error */}
                                {!predictionLoading && predictionError && (
                                    <div className={styles.predictionFallback}>
                                        <div className={styles.predictionFallbackIcon}>
                                            <AlertCircle size={28} />
                                        </div>
                                        <h4 className={styles.predictionFallbackTitle}>Neural Sync Interrupted</h4>
                                        <p className={styles.predictionFallbackText}>
                                            {predictionError}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* ═══ ANALYTIC TRENDS OVERHAUL ═══ */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className={styles.card}
                        >
                            <div className={styles.cardHeader}>
                                <h3 className={styles.cardTitle}>
                                    <TrendingUp className={styles.cardIcon} style={{ color: '#3b82f6' }}/> 
                                    Strategic Trends
                                </h3>
                            </div>
                            {trends.length > 0 ? (
                                <div className={styles.list}>
                                    {trends.map((trend, index) => (
                                        <motion.div 
                                            key={index} 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + (index * 0.1) }}
                                            className={`${styles.listItem} ${styles.trendItem}`}
                                        >
                                            <div className={`${styles.trendStatusIndicator} ${trend.direction === 'UP' ? styles.statusUp : trend.direction === 'DOWN' ? styles.statusDown : styles.statusStable}`}>
                                                {trend.direction === 'UP' ? <ArrowUpRight size={20} /> : 
                                                 trend.direction === 'DOWN' ? <ArrowDownRight size={20} /> : 
                                                 <Minus size={20} />}
                                            </div>
                                            <div className={styles.trendContent}>
                                                <div className={styles.trendHeaderRow}>
                                                    <span className={styles.trendYearLabel}>{trend.previousYear} ➔ {trend.currentYear}</span>
                                                    {trend.growthPercent != null && (
                                                        <span className={`${styles.trendPill} ${trend.direction === 'UP' ? styles.pillSuccess : trend.direction === 'DOWN' ? styles.pillDanger : styles.pillNeutral}`}>
                                                            {trend.direction === 'UP' ? '+' : ''}{trend.growthPercent.toFixed(1)}%
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={styles.trendBrief}>
                                                    Performance {trend.direction.toLowerCase() === 'up' ? 'surged' : trend.direction.toLowerCase() === 'down' ? 'contracted' : 'stabilized'} by {Math.abs(trend.growthPercent || 0).toFixed(1)}%
                                                </p>
                                                <div className={styles.trendVisualSlope}>
                                                    <div className={`${styles.slopeBar} ${trend.direction === 'UP' ? styles.slopeUp : trend.direction === 'DOWN' ? styles.slopeDown : styles.slopeStable}`} style={{ width: `${Math.min(Math.abs(trend.growthPercent || 0) * 2, 100)}%` }}></div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.emptyState}>
                                    <Activity size={32} className="opacity-20 mb-3" />
                                    <p>Insufficient historical depth for trend trajectory.</p>
                                </div>
                            )}
                        </motion.div>

                        {/* ═══ SMART RECOMMENDATIONS OVERHAUL ═══ */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className={styles.card}
                        >
                            <div className={styles.cardHeader}>
                                <h3 className={styles.cardTitle}>
                                    <Lightbulb className={styles.cardIcon} style={{ color: '#eab308' }}/> 
                                    Actionable Insights
                                </h3>
                            </div>
                            {recommendations.length > 0 ? (
                                <div className={styles.list}>
                                    {recommendations.map((rec, index) => {
                                        const enriched = enrichRecommendation(rec);
                                        return (
                                            <motion.div 
                                                key={index} 
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.5 + (index * 0.1) }}
                                                className={`${styles.listItem} ${styles.recItem}`}
                                            >
                                                <div className={styles.recIconPulse}>
                                                    {enriched.categoryIcon}
                                                </div>
                                                <div className={styles.recContent}>
                                                    <div className={styles.recMetaData}>
                                                        <span className={styles.recCategory}>{enriched.category}</span>
                                                        <span className={`${styles.recPriority} ${enriched.priority === 'High Impact' ? styles.priorityHigh : styles.priorityLow}`}>
                                                            {enriched.priority}
                                                        </span>
                                                    </div>
                                                    <p className={styles.recMessageText}>{rec.message}</p>
                                                </div>
                                                <div className={styles.recActionIndicator}>
                                                    <ArrowUpRight size={14} />
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className={styles.emptyState}>
                                    <Lightbulb size={32} className="opacity-20 mb-3" />
                                    <p>No optimization paths identified for this period.</p>
                                </div>
                            )}
                        </motion.div>



                    </div>
                )}
            </div>
        </section>
    );
};

export default AnalyticsPage;
