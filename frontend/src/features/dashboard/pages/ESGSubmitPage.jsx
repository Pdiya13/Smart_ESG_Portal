import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Users, Shield, CheckCircle2, AlertCircle, Loader2, ArrowRight, ArrowLeft, Play, Award } from 'lucide-react';
import api from '../../../utils/api';
import styles from './ESGSubmitPage.module.css';

const ESGSubmitPage = () => {
    const [activeTab, setActiveTab] = useState('environment');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [finalScore, setFinalScore] = useState(null);

    const currentYear = new Date().getFullYear();

    // Form States
    const [envData, setEnvData] = useState({
        reportingYear: currentYear,
        totalElectricityKwh: '', officeAreaSqm: '', dieselUsedLiters: '', renewableEnergyKwh: '',
        dataCenterTotalEnergyKwh: '', dataCenterItEnergyKwh: '', totalWaterLiters: '', recycledWaterLiters: '',
        totalEmployees: '', ewasteGenerated: '', ewasteRecycled: '', electricityEmissionFactor: '',
        dieselEmissionFactor: '', rainwaterHarvesting: false
    });

    const [socData, setSocData] = useState({
        reportingYear: currentYear,
        totalEmployees: '', womenEmployees: '', totalManagers: '', womenManagers: '',
        employeesJoined: '', employeesLeft: '', totalTrainingHours: '', employeeSatisfactionScore: '',
        healthInsuranceCovered: '', mentalHealthProgramCovered: '', workplaceInjuries: '',
        totalWorkHours: '', remoteEmployees: ''
    });

    const [govData, setGovData] = useState({
        reportingYear: currentYear,
        totalBoardMembers: '', independentDirectors: '', femaleDirectors: '', boardMeetings: '',
        independentAttendancePercent: '', dataPrivacyCompliant: false, iso27001Certified: false,
        cybersecurityIncidents: '', whistleblowerComplaints: '', complaintsResolved: '', antiCorruptionViolations: ''
    });

    const handleEnvChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEnvData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSocChange = (e) => {
        const { name, value } = e.target;
        setSocData(prev => ({ ...prev, [name]: value }));
    };

    const handleGovChange = (e) => {
        const { name, value, type, checked } = e.target;
        setGovData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleMessage = (msg, isError = false) => {
        if (isError) {
            setErrorMsg(msg);
            setSuccessMsg('');
        } else {
            setSuccessMsg(msg);
            setErrorMsg('');
        }
        setTimeout(() => { setErrorMsg(''); setSuccessMsg(''); }, 5000);
    };

    // Benchmarks State
    const [benchmarks, setBenchmarks] = useState({
        environment: {},
        social: {},
        governance: {}
    });

    // Fetch benchmarks on mount
    React.useEffect(() => {
        const fetchBenchmarks = async () => {
            try {
                const [envRes, socRes, govRes] = await Promise.all([
                    api.get('/core/environment/benchmark'),
                    api.get('/core/social/benchmark'),
                    api.get('/core/governance/benchmark')
                ]);

                const envMap = {};
                const socMap = {};
                const govMap = {};

                envRes.data?.forEach(b => envMap[b.kpiName] = b.benchmarkValue);
                socRes.data?.forEach(b => socMap[b.kpiName] = b.benchmarkValue);
                govRes.data?.forEach(b => govMap[b.kpiName] = b.benchmarkValue);

                setBenchmarks({ environment: envMap, social: socMap, governance: govMap });
            } catch (err) {
                console.error("Failed to fetch benchmarks:", err);
            }
        };
        fetchBenchmarks();
    }, []);

    const convertToNumberFields = (dataObj) => {
        const parsedData = {};
        for (const [key, value] of Object.entries(dataObj)) {
            if (typeof value === 'boolean') {
                parsedData[key] = value;
            } else if (value === '' || value === null) {
                parsedData[key] = null; // or throw error depending on strictness
            } else {
                parsedData[key] = Number(value);
            }
        }
        return parsedData;
    };

    const validateAgainstBenchmarks = (tab) => {
        const rules = benchmarks[tab];
        if (!rules || Object.keys(rules).length === 0) {
            return `You must set Benchmark targets for the ${tab} pillar before submitting data.`;
        }
        return true;
    };

    const submitAllData = async () => {
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            // Validate all tabs have benchmarks configured
            const envValid = validateAgainstBenchmarks('environment');
            if (envValid !== true) throw new Error(envValid);
            const socValid = validateAgainstBenchmarks('social');
            if (socValid !== true) throw new Error(socValid);
            const govValid = validateAgainstBenchmarks('governance');
            if (govValid !== true) throw new Error(govValid);

            const payload = {
                environment: convertToNumberFields(envData),
                social: convertToNumberFields(socData),
                governance: convertToNumberFields(govData)
            };

            const response = await api.post('/core/submit-all', payload);
            setFinalScore(response.data);
            handleMessage("Complete ESG Report Submitted Successfully!");

        } catch (error) {
            console.error(error);
            handleMessage(error.message || error.response?.data?.message || `Failed to submit ESG data. Please check all fields and try again.`, true);
        } finally {
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <section className={styles.page}>
            <div className={styles.gridBackground}></div>
            <div className={`${styles.decorativeSphere} ${styles.sphere1}`}></div>
            <div className={`${styles.decorativeSphere} ${styles.sphere2}`}></div>

            <div className={styles.container}>
                <div className={styles.header}>
                    <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={styles.title}>
                        Submit ESG Metrics
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={styles.subtitle}>
                        Enter your company's Environmental, Social, and Governance data securely.
                    </motion.p>
                </div>

                <div className={styles.tabs}>
                    <button className={`${styles.tabBtn} ${activeTab === 'environment' ? styles.active : ''}`} onClick={() => setActiveTab('environment')}>
                        <Leaf size={18} /> Environment
                    </button>
                    <button className={`${styles.tabBtn} ${activeTab === 'social' ? styles.active : ''}`} onClick={() => setActiveTab('social')}>
                        <Users size={18} /> Social
                    </button>
                    <button className={`${styles.tabBtn} ${activeTab === 'governance' ? styles.active : ''}`} onClick={() => setActiveTab('governance')}>
                        <Shield size={18} /> Governance
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {successMsg && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 mb-6 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 flex items-center gap-3">
                            <CheckCircle2 /> {successMsg}
                        </motion.div>
                    )}
                    {errorMsg && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 mb-6 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 flex items-center gap-3">
                            <AlertCircle /> {errorMsg}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={styles.formCard}>

                    {/* ENVIRONMENT TAB */}
                    {activeTab === 'environment' && !finalScore && (
                        <div className={styles.formContainer}>
                            <div className={styles.formGrid}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Reporting Year</label>
                                    <input type="number" required name="reportingYear" value={envData.reportingYear} onChange={handleEnvChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Total Electricity (kWh)</label>
                                    <input type="number" step="0.01" required name="totalElectricityKwh" value={envData.totalElectricityKwh} onChange={handleEnvChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Office Area (Sqm)</label>
                                    <input type="number" step="0.01" required name="officeAreaSqm" value={envData.officeAreaSqm} onChange={handleEnvChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Diesel Used (Liters)</label>
                                    <input type="number" step="0.01" required name="dieselUsedLiters" value={envData.dieselUsedLiters} onChange={handleEnvChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Renewable Energy (kWh)</label>
                                    <input type="number" step="0.01" required name="renewableEnergyKwh" value={envData.renewableEnergyKwh} onChange={handleEnvChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Data Center Total Energy (kWh)</label>
                                    <input type="number" step="0.01" required name="dataCenterTotalEnergyKwh" value={envData.dataCenterTotalEnergyKwh} onChange={handleEnvChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Data Center IT Energy (kWh)</label>
                                    <input type="number" step="0.01" required name="dataCenterItEnergyKwh" value={envData.dataCenterItEnergyKwh} onChange={handleEnvChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Total Water (Liters)</label>
                                    <input type="number" step="0.01" required name="totalWaterLiters" value={envData.totalWaterLiters} onChange={handleEnvChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Recycled Water (Liters)</label>
                                    <input type="number" step="0.01" required name="recycledWaterLiters" value={envData.recycledWaterLiters} onChange={handleEnvChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Total Employees</label>
                                    <input type="number" required name="totalEmployees" value={envData.totalEmployees} onChange={handleEnvChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>E-Waste Generated (kg)</label>
                                    <input type="number" step="0.01" required name="ewasteGenerated" value={envData.ewasteGenerated} onChange={handleEnvChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>E-Waste Recycled (kg)</label>
                                    <input type="number" step="0.01" required name="ewasteRecycled" value={envData.ewasteRecycled} onChange={handleEnvChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Electricity Emission Factor (kgCO2/kWh)</label>
                                    <input type="number" step="0.01" required name="electricityEmissionFactor" value={envData.electricityEmissionFactor} onChange={handleEnvChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Diesel Emission Factor (kgCO2/liter)</label>
                                    <input type="number" step="0.01" required name="dieselEmissionFactor" value={envData.dieselEmissionFactor} onChange={handleEnvChange} className={styles.input} />
                                </div>

                                <label className={styles.checkboxContainer}>
                                    <input type="checkbox" name="rainwaterHarvesting" checked={envData.rainwaterHarvesting} onChange={handleEnvChange} className={styles.checkbox} />
                                    Rainwater Harvesting Enabled
                                </label>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
                                <button onClick={() => setActiveTab('social')} className={styles.nextBtn}>
                                    Next: Social <ArrowRight size={18} className="ml-2" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* SOCIAL TAB */}
                    {activeTab === 'social' && !finalScore && (
                        <div className={styles.formContainer}>
                            <div className={styles.formGrid}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Reporting Year</label>
                                    <input type="number" required name="reportingYear" value={socData.reportingYear} onChange={handleSocChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Total Employees</label>
                                    <input type="number" required name="totalEmployees" value={socData.totalEmployees} onChange={handleSocChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Women Employees</label>
                                    <input type="number" required name="womenEmployees" value={socData.womenEmployees} onChange={handleSocChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Total Managers</label>
                                    <input type="number" required name="totalManagers" value={socData.totalManagers} onChange={handleSocChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Women Managers</label>
                                    <input type="number" required name="womenManagers" value={socData.womenManagers} onChange={handleSocChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Employees Joined</label>
                                    <input type="number" required name="employeesJoined" value={socData.employeesJoined} onChange={handleSocChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Employees Left</label>
                                    <input type="number" required name="employeesLeft" value={socData.employeesLeft} onChange={handleSocChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Total Training Hours</label>
                                    <input type="number" step="0.01" required name="totalTrainingHours" value={socData.totalTrainingHours} onChange={handleSocChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Employee Satisfaction Score</label>
                                    <input type="number" step="0.01" required name="employeeSatisfactionScore" value={socData.employeeSatisfactionScore} onChange={handleSocChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Health Insurance Covered</label>
                                    <input type="number" required name="healthInsuranceCovered" value={socData.healthInsuranceCovered} onChange={handleSocChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Mental Health Program Covered</label>
                                    <input type="number" required name="mentalHealthProgramCovered" value={socData.mentalHealthProgramCovered} onChange={handleSocChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Workplace Injuries</label>
                                    <input type="number" required name="workplaceInjuries" value={socData.workplaceInjuries} onChange={handleSocChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Total Work Hours</label>
                                    <input type="number" step="0.01" required name="totalWorkHours" value={socData.totalWorkHours} onChange={handleSocChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Remote Employees</label>
                                    <input type="number" required name="remoteEmployees" value={socData.remoteEmployees} onChange={handleSocChange} className={styles.input} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '32px' }}>
                                <button onClick={() => setActiveTab('environment')} className={styles.prevBtn}>
                                    <ArrowLeft size={18} className="mr-2" /> Prev: Environment
                                </button>
                                <button onClick={() => setActiveTab('governance')} className={styles.nextBtn}>
                                    Next: Governance <ArrowRight size={18} className="ml-2" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* GOVERNANCE TAB */}
                    {activeTab === 'governance' && !finalScore && (
                        <div className={styles.formContainer}>
                            <div className={styles.formGrid}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Reporting Year</label>
                                    <input type="number" required name="reportingYear" value={govData.reportingYear} onChange={handleGovChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Total Board Members</label>
                                    <input type="number" required name="totalBoardMembers" value={govData.totalBoardMembers} onChange={handleGovChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Independent Directors</label>
                                    <input type="number" required name="independentDirectors" value={govData.independentDirectors} onChange={handleGovChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Female Directors</label>
                                    <input type="number" required name="femaleDirectors" value={govData.femaleDirectors} onChange={handleGovChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Board Meetings</label>
                                    <input type="number" required name="boardMeetings" value={govData.boardMeetings} onChange={handleGovChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Independent Attendance (%)</label>
                                    <input type="number" step="0.01" required name="independentAttendancePercent" value={govData.independentAttendancePercent} onChange={handleGovChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Cybersecurity Incidents</label>
                                    <input type="number" required name="cybersecurityIncidents" value={govData.cybersecurityIncidents} onChange={handleGovChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Whistleblower Complaints</label>
                                    <input type="number" required name="whistleblowerComplaints" value={govData.whistleblowerComplaints} onChange={handleGovChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Complaints Resolved</label>
                                    <input type="number" required name="complaintsResolved" value={govData.complaintsResolved} onChange={handleGovChange} className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Anti-Corruption Violations</label>
                                    <input type="number" required name="antiCorruptionViolations" value={govData.antiCorruptionViolations} onChange={handleGovChange} className={styles.input} />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label className={styles.checkboxContainer}>
                                        <input type="checkbox" name="dataPrivacyCompliant" checked={govData.dataPrivacyCompliant} onChange={handleGovChange} className={styles.checkbox} />
                                        Data Privacy Compliant
                                    </label>
                                    <label className={styles.checkboxContainer}>
                                        <input type="checkbox" name="iso27001Certified" checked={govData.iso27001Certified} onChange={handleGovChange} className={styles.checkbox} />
                                        ISO 27001 Certified
                                    </label>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '32px' }}>
                                <button onClick={() => setActiveTab('social')} className={styles.prevBtn}>
                                    <ArrowLeft size={18} className="mr-2" /> Prev: Social
                                </button>
                                <button onClick={submitAllData} className={styles.submitAllBtn} disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin inline-block mr-2" /> : <><Play fill="currentColor" size={18} className="mr-2" /> Compute Final ESG Report</>}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* SUCCESS SCORE CARD */}
                    {finalScore && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={styles.successCardContainer}
                        >
                            <div className={styles.successCardGlow}></div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className={styles.successIconContainer}
                            >
                                <Award size={48} />
                            </motion.div>

                            <h2 className={styles.successTitle}>Report Submitted Successfully</h2>
                            <p className={styles.successSubtitle}>Your comprehensive ESG data for {finalScore.reportingYear} has been calculated against your benchmarks.</p>

                            <div className={styles.scoreCardsContainer}>
                                <div className={styles.scoreCard}>
                                    <div className={styles.scoreCardLabel}>Total Score</div>
                                    <div className={`${styles.scoreCardValue} ${styles.scoreCardValueTotal}`}>
                                        {Math.round(finalScore.totalEsgScore)}<span className={styles.scoreMax}>/100</span>
                                    </div>
                                </div>
                                <div className={styles.scoreCard}>
                                    <div className={styles.scoreCardLabel}>Rating</div>
                                    <div className={`${styles.scoreCardValue} ${styles.scoreCardValueRating}`} style={{
                                        color: finalScore.rating === 'A' ? '#34d399' :
                                            finalScore.rating === 'B' ? '#facc15' : '#f87171'
                                    }}>
                                        {finalScore.rating}
                                    </div>
                                </div>
                            </div>

                            <div style={{ position: 'relative', zIndex: 10 }}>
                                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                                    <button className={styles.backToDashboardBtn}>
                                        Back to Dashboard <ArrowRight size={20} />
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default ESGSubmitPage;
