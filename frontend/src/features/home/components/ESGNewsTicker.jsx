import { motion } from 'framer-motion';
import { Megaphone } from 'lucide-react';
import styles from './ESGNewsTicker.module.css';

const newsItems = [
    "Global: Average carbon emissions dropped 2% this quarter across tracked enterprises.",
    "System: New EU CSRD reporting framework templates are now available.",
    "Milestone: Over 10,000 ESG reports successfully processed this year.",
    "Update: Social metrics benchmarking now includes Diversity & Inclusion sub-scores.",
    "Alert: Governance compliance module updated with latest ISO 37000 standards."
];

const ESGNewsTicker = () => {
    return (
        <div className={styles.tickerContainer}>
            <div className={styles.badge}>
                <Megaphone className="w-4 h-4 mr-2" />
                Live Updates
            </div>
            <div className={styles.marqueeWrapper}>
                <motion.div
                    className={styles.marqueeContent}
                    animate={{ x: [0, -1035] }} // Adjust duration based on content width
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30
                    }}
                >
                    {/* Render twice for seamless looping */}
                    <div className={styles.newsGroup}>
                        {newsItems.map((item, index) => (
                            <span key={`a-${index}`} className={styles.newsItem}>
                                <span className={styles.dot}></span>
                                {item}
                            </span>
                        ))}
                    </div>
                    <div className={styles.newsGroup}>
                        {newsItems.map((item, index) => (
                            <span key={`b-${index}`} className={styles.newsItem}>
                                <span className={styles.dot}></span>
                                {item}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ESGNewsTicker;
