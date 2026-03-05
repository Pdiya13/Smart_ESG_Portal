import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import {
    UploadCloud,
    Leaf,
    Users,
    Scale,
    Calculator,
    LineChart,
    Award,
    FileText,
    LayoutDashboard,
    ShieldCheck
} from 'lucide-react';
import styles from './FeaturesPage.module.css';

const MOCK_FEATURES = [
    {
        id: 2,
        title: "Flexible ESG Data Submission",
        description: "Organizations can submit ESG data through easy-to-use forms or upload structured CSV files. This allows companies to quickly collect sustainability metrics such as energy consumption, water usage, employee data, and governance indicators.",
        icon: <UploadCloud size={32} />,
        colorClass: styles.iconBlue,
        category: "Data Collection"
    },
    {
        id: 3,
        title: "Environmental Performance Tracking",
        description: "Track environmental metrics including electricity usage, diesel consumption, renewable energy usage, water consumption, and carbon emissions. The system calculates environmental performance indicators automatically.",
        icon: <Leaf size={32} />,
        colorClass: styles.iconGreen,
        category: "Environment"
    },
    {
        id: 4,
        title: "Social Impact Monitoring",
        description: "Monitor workforce-related ESG metrics such as employee diversity, workforce size, training hours, and community engagement indicators. This helps organizations evaluate their social responsibility performance.",
        icon: <Users size={32} />,
        colorClass: styles.iconOrange,
        category: "Social"
    },
    {
        id: 5,
        title: "Governance and Ethical Oversight",
        description: "Track governance-related metrics such as board diversity, compliance indicators, policy transparency, and leadership structure to ensure responsible corporate governance.",
        icon: <Scale size={32} />,
        colorClass: styles.iconPurple,
        category: "Governance"
    },
    {
        id: 6,
        title: "Automated KPI Processing",
        description: "The system processes submitted ESG data and automatically calculates ESG Key Performance Indicators (KPIs). These KPIs help organizations measure sustainability performance across environmental, social, and governance pillars.",
        icon: <Calculator size={32} />,
        colorClass: styles.iconPink,
        category: "Analytics"
    },
    {
        id: 7,
        title: "Performance Benchmarking",
        description: "Organizations can compare their ESG performance against predefined benchmark values. This helps companies understand how they perform relative to sustainability standards.",
        icon: <LineChart size={32} />,
        colorClass: styles.iconBlue,
        category: "Analytics"
    },
    {
        id: 8,
        title: "Comprehensive ESG Score Calculation",
        description: "The platform calculates ESG scores for Environmental, Social, and Governance pillars and provides an overall ESG rating that reflects the organization's sustainability performance.",
        icon: <Award size={32} />,
        colorClass: styles.iconGreen,
        category: "Rating"
    },
    {
        id: 9,
        title: "Automated ESG Reporting",
        description: "Generate structured ESG reports based on collected data and calculated KPIs. These reports can be used for internal analysis, stakeholder communication, and regulatory reporting.",
        icon: <FileText size={32} />,
        colorClass: styles.iconPurple,
        category: "Reporting"
    },
    {
        id: 10,
        title: "Real-Time ESG Dashboard",
        description: "A centralized dashboard provides visual insights into ESG performance using charts, indicators, and summary metrics, helping organizations quickly understand their sustainability status.",
        icon: <LayoutDashboard size={32} />,
        colorClass: styles.iconOrange,
        category: "Dashboard"
    },
    {
        id: 11,
        title: "Secure Role-Based Access",
        description: "The platform includes a secure authentication system where administrators, businesses, and users have role-based access to ESG data and platform features.",
        icon: <ShieldCheck size={32} />,
        colorClass: styles.iconPink,
        category: "Security"
    }
];

const FeatureCard = ({ feature, index }) => {
    const cardRef = useRef(null);

    // Mouse hover effect to track mouse position slightly for the background radial gradient glow
    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardRef.current.style.setProperty('--mouse-x', `${x}px`);
        cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onMouseMove={handleMouseMove}
            className={styles.featureCard}
        >
            <span className={styles.categoryLabel}>{feature.category}</span>
            <div className={`${styles.iconWrapper} ${feature.colorClass}`}>
                {feature.icon}
            </div>
            <h3 className={styles.featureTitle}>{feature.title}</h3>
            <p className={styles.featureDescription}>{feature.description}</p>
        </motion.div>
    );
};

const FeaturesPage = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={styles.pageWrapper}>
            {/* Background Grid */}
            <div className={styles.gridBackground}></div>

            {/* Section 1 - Features Introduction */}
            <section className={styles.heroSection}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className={styles.heroBadge}
                >
                    Platform Capabilities
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className={styles.heroTitle}
                >
                    Powerful ESG Management Features
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={styles.heroDescription}
                >
                    Smart ESG Portal provides tools for collecting, analyzing, and reporting ESG data in one centralized platform. It helps organizations track sustainability metrics, monitor ESG performance, and generate reports efficiently.
                </motion.p>
            </section>

            {/* Sections 2 to 11 - Feature Cards */}
            <section className={styles.featuresGrid}>
                {MOCK_FEATURES.map((feature, index) => (
                    <FeatureCard key={feature.id} feature={feature} index={index % 3} />
                ))}
            </section>
        </div>
    );
};

export default FeaturesPage;
