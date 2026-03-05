import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../shared/components/ui/Button';
import { ArrowRight, Leaf, Shield, Users } from 'lucide-react';
import styles from './HeroSection.module.css';

const PHRASES = [
    "Empowering sustainable futures.",
    "Driving ethical business growth.",
    "Transforming compliance into value.",
    "Building a transparent tomorrow."
];

const HeroSection = () => {
    const [currentPhrase, setCurrentPhrase] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPhrase((prev) => (prev + 1) % PHRASES.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className={styles.heroSectionWrapper}>
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

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                            className={styles.esgTitleContainer}
                        >
                            <h1 className={styles.titleWrapper}>
                                <div className={styles.esgWord}>
                                    <span className={styles.letterE}>E</span>nvironmental
                                </div>
                                <div className={styles.esgWord}>
                                    <span className={styles.letterS}>S</span>ocial
                                </div>
                                <div className={styles.esgWord}>
                                    <span className={styles.letterG}>G</span>overnance
                                </div>
                            </h1>
                        </motion.div>

                        <div className={styles.dynamicTextContainer}>
                            <AnimatePresence mode="wait">
                                <motion.h2
                                    key={currentPhrase}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.5 }}
                                    className={styles.dynamicText}
                                >
                                    {PHRASES[currentPhrase]}
                                </motion.h2>
                            </AnimatePresence>
                        </div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className={styles.description}
                        >
                            A comprehensive platform to monitor, analyze, and report your Environmental, Social, and Governance performance with real-time analytics. Uncover actionable insights and achieve your sustainability goals effortlessly.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className={styles.actions}
                        >
                            <Link to="/register">
                                <Button size="lg" className="group">
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Continuous Sliding Cards Section */}
                        <div className={styles.marqueeContainer}>
                            <motion.div
                                className={styles.marqueeTrack}
                                animate={{ x: [0, "-50%"] }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            >
                                {[...Array(2)].map((_, index) => (
                                    <React.Fragment key={index}>
                                        <div className={styles.floatingCard}>
                                            <div className={`${styles.iconWrapperCard} ${styles.bgE}`}>
                                                <Leaf size={24} className={styles.letterE} />
                                            </div>
                                            <div className={styles.floaterText}>
                                                <span className={styles.floaterTitle}>Decarbonization</span>
                                                <span className={styles.floaterSub}>Carbon Tracking</span>
                                            </div>
                                        </div>
                                        <div className={styles.floatingCard}>
                                            <div className={`${styles.iconWrapperCard} ${styles.bgS}`}>
                                                <Users size={24} className={styles.letterS} />
                                            </div>
                                            <div className={styles.floaterText}>
                                                <span className={styles.floaterTitle}>Social Value</span>
                                                <span className={styles.floaterSub}>Community Impact</span>
                                            </div>
                                        </div>
                                        <div className={styles.floatingCard}>
                                            <div className={`${styles.iconWrapperCard} ${styles.bgG}`}>
                                                <Shield size={24} className={styles.letterG} />
                                            </div>
                                            <div className={styles.floaterText}>
                                                <span className={styles.floaterTitle}>Audit Ready</span>
                                                <span className={styles.floaterSub}>100% Compliant</span>
                                            </div>
                                        </div>
                                        <div className={styles.floatingCard}>
                                            <div className={`${styles.iconWrapperCard} ${styles.bgE}`}>
                                                <Leaf size={24} className={styles.letterE} />
                                            </div>
                                            <div className={styles.floaterText}>
                                                <span className={styles.floaterTitle}>Net Zero Goals</span>
                                                <span className={styles.floaterSub}>Target Alignment</span>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </motion.div>
                        </div>

                    </div>
                </div>
            </section>
        </section>
    );
};

export default HeroSection;
