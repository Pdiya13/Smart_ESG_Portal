import { motion } from 'framer-motion';
import { BarChart3, Users, Scale, FileText } from 'lucide-react';
import styles from './FeatureGrid.module.css';

const features = [
    {
        title: 'Environment',
        description: 'Track carbon footprint, energy usage, and waste management metrics.',
        icon: <BarChart3 className="w-6 h-6" />,
    },
    {
        title: 'Social',
        description: 'Monitor labor standards, community engagement, and diversity metrics.',
        icon: <Users className="w-6 h-6" />,
    },
    {
        title: 'Governance',
        description: 'Ensure compliance, ethical standards, and board diversity.',
        icon: <Scale className="w-6 h-6" />,
    },
    {
        title: 'Reporting',
        description: 'Generate comprehensive ESG reports ready for audit and stakeholders.',
        icon: <FileText className="w-6 h-6" />,
    },
];

const FeatureGrid = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Core ESG Modules</h2>
                    <p className={styles.description}>
                        Everything you need to manage your environmental, social, and governance responsibilities in one place.
                    </p>
                </div>

                <div className={styles.grid}>
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={styles.card}
                        >
                            <div className={styles.iconBox}>
                                {feature.icon}
                            </div>
                            <h3 className={styles.cardTitle}>{feature.title}</h3>
                            <p className={styles.cardDesc}>
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureGrid;
