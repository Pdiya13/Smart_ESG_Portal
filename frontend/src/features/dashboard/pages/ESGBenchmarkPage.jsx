import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Leaf, Users, Shield, CheckCircle2, AlertCircle, Loader2, Save, Upload, FileSpreadsheet, Play } from 'lucide-react';
import api from '../../../utils/api';
import styles from './ESGBenchmarkPage.module.css';

const ESGBenchmarkPage = () => {
    const [activeTab, setActiveTab] = useState('environment');
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

    const [envBenchmarks, setEnvBenchmarks] = useState({ EUI: '', RENEWABLE_PERCENT: '', PUE: '', WATER_PER_EMP: '', EWASTE_RECYCLE: '', CARBON_INTENSITY: '' });
    const [socBenchmarks, setSocBenchmarks] = useState({ WOMEN_WORKFORCE: '', WOMEN_LEADERSHIP: '', ATTRITION: '', TRAINING: '', SATISFACTION: '', INSURANCE: '', LTIFR: '', MENTAL_HEALTH: '' });
    const [govBenchmarks, setGovBenchmarks] = useState({ ATTENDANCE: '', BOARD_MEETINGS: '', FEMALE_DIRECTORS: '', DATA_PRIVACY: false, ISO_27001: false, CYBER_INCIDENTS: '', WHISTLEBLOWER_RESOLUTION: '', ANTI_CORRUPTION: '', BOARD_INDEPENDENCE: '' });

    useEffect(() => {
        const fetchBenchmarks = async () => {
            try {
                const [envRes, socRes, govRes] = await Promise.all([
                    api.get('/core/environment/benchmark'),
                    api.get('/core/social/benchmark'),
                    api.get('/core/governance/benchmark')
                ]);

                const envMap = {}; envRes.data?.forEach(b => envMap[b.kpiName] = b.benchmarkValue);
                setEnvBenchmarks(prev => ({ ...prev, ...envMap }));

                const socMap = {}; socRes.data?.forEach(b => socMap[b.kpiName] = b.benchmarkValue);
                setSocBenchmarks(prev => ({ ...prev, ...socMap }));

                const govMap = {}; govRes.data?.forEach(b => {
                    const val = b.benchmarkValue;
                    govMap[b.kpiName] = (b.kpiName === 'DATA_PRIVACY' || b.kpiName === 'ISO_27001') ? (val === 1 || val === true || val === 'true') : val;
                });
                setGovBenchmarks(prev => ({ ...prev, ...govMap }));
            } catch (err) { console.error("Failed to fetch benchmarks:", err); }
        };
        fetchBenchmarks();
    }, []);

    const handleEnvChange = (e) => {
        const { name, value } = e.target;
        setEnvBenchmarks(prev => ({ ...prev, [name]: value }));
    };

    const handleSocChange = (e) => {
        const { name, value } = e.target;
        setSocBenchmarks(prev => ({ ...prev, [name]: value }));
    };

    const handleGovChange = (e) => {
        const { name, value, type, checked } = e.target;
        setGovBenchmarks(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e, pillar) => {
        e.preventDefault();
        setLoading(true);
        setSubmitStatus({ type: '', message: '' });

        let data = pillar === 'Environment' ? envBenchmarks : pillar === 'Social' ? socBenchmarks : govBenchmarks;
        const endpoint = pillar === 'Environment' ? '/core/environment/benchmark' : pillar === 'Social' ? '/core/social/benchmark' : '/core/governance/benchmark';

        try {
            const promises = Object.entries(data).map(([key, val]) => {
                const parsedVal = typeof val === 'boolean' ? (val ? 1 : 0) : (val === '' ? 0 : Number(val));
                return api.post(endpoint, {
                    kpiName: key,
                    benchmarkValue: parsedVal
                });
            });

            await Promise.all(promises);
            
            setSubmitStatus({ type: 'success', message: `${pillar} benchmarks updated successfully!` });
            setTimeout(() => setSubmitStatus({ type: '', message: '' }), 4000);
        } catch (err) {
            console.error(err);
            setSubmitStatus({ type: 'error', message: err.response?.data?.message || `Failed to update ${pillar} benchmarks.` });
        } finally {
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderEnvironmentForm = () => (
        <form onSubmit={(e) => handleSubmit(e, 'Environment')} className={styles.formGrid}>
            <div className={styles.inputGroup}><label className={styles.label}>Max EUI (kWh/m²)</label><input type="number" name="EUI" value={envBenchmarks.EUI} onChange={handleEnvChange} className={styles.input} required min="0" step="0.1" /></div>
            <div className={styles.inputGroup}><label className={styles.label}>Min Renewable Energy (%)</label><input type="number" name="RENEWABLE_PERCENT" value={envBenchmarks.RENEWABLE_PERCENT} onChange={handleEnvChange} className={styles.input} required min="0" max="100" /></div>
            <div className={styles.inputGroup}><label className={styles.label}>Max PUE</label><input type="number" name="PUE" value={envBenchmarks.PUE} onChange={handleEnvChange} className={styles.input} required min="1" step="0.01" /></div>
            <div className={styles.inputGroup}><label className={styles.label}>Max Water per Employee (L/day)</label><input type="number" name="WATER_PER_EMP" value={envBenchmarks.WATER_PER_EMP} onChange={handleEnvChange} className={styles.input} required min="0" step="0.1" /></div>
            <div className={styles.inputGroup}><label className={styles.label}>Min E-Waste Recycled (%)</label><input type="number" name="EWASTE_RECYCLE" value={envBenchmarks.EWASTE_RECYCLE} onChange={handleEnvChange} className={styles.input} required min="0" max="100" /></div>
            <div className={styles.inputGroup}><label className={styles.label}>Max Carbon Intensity (kgCO2/m²)</label><input type="number" name="CARBON_INTENSITY" value={envBenchmarks.CARBON_INTENSITY} onChange={handleEnvChange} className={styles.input} required min="0" step="0.1" /></div>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Update Environment Benchmarks</>}
            </button>
        </form>
    );

    const renderSocialForm = () => (
        <form onSubmit={(e) => handleSubmit(e, 'Social')} className={styles.formGrid}>
            <div className={styles.inputGroup}><label className={styles.label}>Min Women Workforce (%)</label><input type="number" name="WOMEN_WORKFORCE" value={socBenchmarks.WOMEN_WORKFORCE} onChange={handleSocChange} className={styles.input} required min="0" max="100" /></div>
            <div className={styles.inputGroup}><label className={styles.label}>Min Women Leadership (%)</label><input type="number" name="WOMEN_LEADERSHIP" value={socBenchmarks.WOMEN_LEADERSHIP} onChange={handleSocChange} className={styles.input} required min="0" max="100" /></div>
            <div className={styles.inputGroup}><label className={styles.label}>Max Attrition Rate (%)</label><input type="number" name="ATTRITION" value={socBenchmarks.ATTRITION} onChange={handleSocChange} className={styles.input} required min="0" max="100" /></div>
            <div className={styles.inputGroup}><label className={styles.label}>Min Training Hours</label><input type="number" name="TRAINING" value={socBenchmarks.TRAINING} onChange={handleSocChange} className={styles.input} required min="0" /></div>
            <div className={styles.inputGroup}><label className={styles.label}>Min Satisfaction Score (%)</label><input type="number" name="SATISFACTION" value={socBenchmarks.SATISFACTION} onChange={handleSocChange} className={styles.input} required min="0" max="100" /></div>
            <div className={styles.inputGroup}><label className={styles.label}>Min Insured Employees (%)</label><input type="number" name="INSURANCE" value={socBenchmarks.INSURANCE} onChange={handleSocChange} className={styles.input} required min="0" max="100" /></div>
            <div className={styles.inputGroup}><label className={styles.label}>Max LTIFR</label><input type="number" name="LTIFR" value={socBenchmarks.LTIFR} onChange={handleSocChange} className={styles.input} required min="0" step="0.01" /></div>
            <div className={styles.inputGroup}><label className={styles.label}>Min Mental Health Enrollment (%)</label><input type="number" name="MENTAL_HEALTH" value={socBenchmarks.MENTAL_HEALTH} onChange={handleSocChange} className={styles.input} required min="0" max="100" /></div>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Update Social Benchmarks</>}
            </button>
        </form>
    );

    const renderGovernanceForm = () => (
        <form onSubmit={(e) => handleSubmit(e, 'Governance')} className={styles.formGrid}>
            <div className={styles.inputGroup}><label className={styles.label}>Min Board Attendance (%)</label><input type="number" name="ATTENDANCE" value={govBenchmarks.ATTENDANCE} onChange={handleGovChange} className={styles.input} required min="0" max="100" /></div>
            <div className={styles.inputGroup}><label className={styles.label}>Min Annual Board Meetings</label><input type="number" name="BOARD_MEETINGS" value={govBenchmarks.BOARD_MEETINGS} onChange={handleGovChange} className={styles.input} required min="0" /></div>
            <div className={styles.inputGroup}><label className={styles.label}>Min Female Directors (%)</label><input type="number" name="FEMALE_DIRECTORS" value={govBenchmarks.FEMALE_DIRECTORS} onChange={handleGovChange} className={styles.input} required min="0" max="100" /></div>
            <div className={styles.inputGroup}><label className={styles.label}>Max Cyber Incidents</label><input type="number" name="CYBER_INCIDENTS" value={govBenchmarks.CYBER_INCIDENTS} onChange={handleGovChange} className={styles.input} required min="0" /></div>
            <div className={styles.inputGroup}><label className={styles.label}>Min Whistleblower Resolution (%)</label><input type="number" name="WHISTLEBLOWER_RESOLUTION" value={govBenchmarks.WHISTLEBLOWER_RESOLUTION} onChange={handleGovChange} className={styles.input} required min="0" max="100" /></div>
            <div className={styles.inputGroup}><label className={styles.label}>Max Anti-Corruption Violations</label><input type="number" name="ANTI_CORRUPTION" value={govBenchmarks.ANTI_CORRUPTION} onChange={handleGovChange} className={styles.input} required min="0" /></div>
            <div className={styles.inputGroup}><label className={styles.label}>Min Independent Directors (%)</label><input type="number" name="BOARD_INDEPENDENCE" value={govBenchmarks.BOARD_INDEPENDENCE} onChange={handleGovChange} className={styles.input} required min="0" max="100" /></div>
            <div className="flex flex-col gap-4 justify-center">
                <label className={styles.checkboxContainer}><input type="checkbox" name="DATA_PRIVACY" checked={govBenchmarks.DATA_PRIVACY} onChange={handleGovChange} className={styles.checkbox} /> Data Privacy Plan Mandatory</label>
                <label className={styles.checkboxContainer}><input type="checkbox" name="ISO_27001" checked={govBenchmarks.ISO_27001} onChange={handleGovChange} className={styles.checkbox} /> ISO 27001 Certification Required</label>
            </div>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Update Governance Benchmarks</>}
            </button>
        </form>
    );

    return (
        <section className={styles.page}>
            <div className={styles.gridBackground}></div>
            <div className={`${styles.decorativeSphere} ${styles.sphere1}`}></div>
            <div className={`${styles.decorativeSphere} ${styles.sphere2}`}></div>

            <div className={styles.container}>
                <div className={styles.header}>
                    <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={styles.title}>
                        Set ESG Benchmarks
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={styles.subtitle}>
                        Define your corporate ESG targets and validation limits to calculate performance scores.
                    </motion.p>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={styles.modeSwitcher}>
                        <button className={`${styles.modeBtn} ${styles.active}`}><Play size={16} fill="currentColor" /> Fill Manually</button>
                        <Link to="/upload-benchmarks" className={`${styles.modeBtn} ${styles.link}`}><FileSpreadsheet size={16} /> Upload CSV / Excel</Link>
                    </motion.div>
                </div>

                <AnimatePresence>
                    {submitStatus.message && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${submitStatus.type === 'success' ? 'bg-green-500/10 text-green-700 border border-green-500/20' : 'bg-red-500/10 text-red-700 border border-red-500/20'}`}>
                            {submitStatus.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <span className="font-medium">{submitStatus.message}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className={styles.tabs}>
                    <button onClick={() => setActiveTab('environment')} className={`${styles.tabBtn} ${activeTab === 'environment' ? styles.active : ''}`}><Leaf size={18} /> Environment</button>
                    <button onClick={() => setActiveTab('social')} className={`${styles.tabBtn} ${activeTab === 'social' ? styles.active : ''}`}><Users size={18} /> Social</button>
                    <button onClick={() => setActiveTab('governance')} className={`${styles.tabBtn} ${activeTab === 'governance' ? styles.active : ''}`}><Shield size={18} /> Governance</button>
                </div>

                <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className={styles.formCard}>
                    {activeTab === 'environment' && renderEnvironmentForm()}
                    {activeTab === 'social' && renderSocialForm()}
                    {activeTab === 'governance' && renderGovernanceForm()}
                </motion.div>
            </div>
        </section>
    );
};

export default ESGBenchmarkPage;
