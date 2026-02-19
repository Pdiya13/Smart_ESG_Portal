import { motion } from 'framer-motion';
import { Button } from '../../../shared/components/ui/Button';
import { ArrowRight, BarChart3, Globe, ShieldCheck } from 'lucide-react';
import styles from './HeroSection.module.css';

const HeroSection = () => {
    return (
        <section className={styles.hero}>
            {/* Background Grid */}
            <div className={styles.gridBackground}></div>

            <div className={styles.container}>
                <div className={styles.content}>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className={styles.badge}
                    >
                        <span className={styles.badgeDot}></span>
                        Smart ESG Intelligence
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className={styles.title}
                    >
                        Sustainability Reporting <br />
                        <span className={styles.subtitle}>Reimagined.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className={styles.description}
                    >
                        A comprehensive platform to monitor, analyze, and report your Environmental, Social, and Governance performance with real-time analytics.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className={styles.actions}
                    >
                        <Button size="lg" className="group"> {/* Kept group for hover logic if enabled in global css, but usually specific classes are better. I'll rely on Button's hover states */}
                            Get Started
                            <ArrowRight className="ml-2 h-4 w-4" /> {/* inline styles/classes for icon sizing is fine or I can add a utility class */}
                        </Button>
                        <Button variant="outline" size="lg">
                            View Demo
                        </Button>
                    </motion.div>

                    {/* 3D Floating Cards Effect */}
                    <div className={styles.scene}>
                        <motion.div
                            initial={{ opacity: 0, rotateX: 20, y: 100 }}
                            animate={{ opacity: 1, rotateX: 0, y: 0 }}
                            transition={{ duration: 1, delay: 0.8, type: "spring" }}
                            className={styles.mainCard}
                        >
                            <div className={styles.cardHeader}>
                                <h3 className={styles.cardTitle}>ESG Performance Overview</h3>
                                <span className={styles.scoreBadge}>+12.5%</span>
                            </div>
                            <div className={styles.chartContainer}>
                                {[40, 70, 50, 90, 60, 80, 75].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ duration: 1, delay: 1 + (i * 0.1) }}
                                        className={styles.bar}
                                    />
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className={styles.floatingCardLeft}
                        >
                            <div className={styles.miniCardHeader}>
                                <div className={styles.iconBox}><Globe size={20} /></div>
                                <div>
                                    <div className={styles.miniCardTitle}>Environment</div>
                                    <div className={styles.miniCardSub}>Score: 85/100</div>
                                </div>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '85%' }}></div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, -25, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className={styles.floatingCardRight}
                        >
                            <div className={styles.miniCardHeader}>
                                <div className={styles.iconBox}><ShieldCheck size={20} /></div>
                                <div>
                                    <div className={styles.miniCardTitle}>Governance</div>
                                    <div className={styles.miniCardSub}>Audit Ready</div>
                                </div>
                            </div>
                            <div className={styles.compliantBadge}>
                                <span className={styles.dot}></span>
                                Compliant
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HeroSection;
