import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import { Leaf, Users, Shield, CheckCircle2, AlertCircle, Loader2, ArrowRight, ArrowLeft, Play, Award, Upload, Download, FileSpreadsheet, Eye, X, Info } from 'lucide-react';
import api from '../../../utils/api';
import styles from './ESGSubmitPage.module.css';


// ─── Template field definitions (mirrors ESGUploadPage) ───────────────────────
const ENV_FIELDS = {
    env_reportingYear: { label: 'Reporting Year', hint: 'e.g. 2025', example: 2025 },
    env_totalElectricityKwh: { label: 'Total Electricity (kWh)', hint: 'Annual consumption in kWh', example: 500000 },
    env_officeAreaSqm: { label: 'Office Area (sqm)', hint: 'Total office floor area in m²', example: 2000 },
    env_dieselUsedLiters: { label: 'Diesel Used (Liters)', hint: 'Annual diesel consumption', example: 3000 },
    env_renewableEnergyKwh: { label: 'Renewable Energy (kWh)', hint: 'Solar/wind energy consumed', example: 150000 },
    env_dataCenterTotalEnergyKwh: { label: 'Data Center Total Energy (kWh)', hint: 'Total data center energy', example: 80000 },
    env_dataCenterItEnergyKwh: { label: 'Data Center IT Energy (kWh)', hint: 'IT equipment energy only', example: 60000 },
    env_totalWaterLiters: { label: 'Total Water (Liters)', hint: 'Annual water consumption', example: 1000000 },
    env_recycledWaterLiters: { label: 'Recycled Water (Liters)', hint: 'Recycled/harvested water used', example: 200000 },
    env_totalEmployees: { label: 'Total Employees (Env)', hint: 'Headcount for env. calculations', example: 500 },
    env_ewasteGenerated: { label: 'E-Waste Generated (kg)', hint: 'Total electronic waste produced', example: 1200 },
    env_ewasteRecycled: { label: 'E-Waste Recycled (kg)', hint: 'Amount recycled or refurbished', example: 900 },
    env_electricityEmissionFactor: { label: 'Electricity Emission Factor (kgCO2/kWh)', hint: 'Grid emission factor for your region', example: 0.82 },
    env_dieselEmissionFactor: { label: 'Diesel Emission Factor (kgCO2/L)', hint: 'Standard: 2.68 kgCO2/liter', example: 2.68 },
    env_rainwaterHarvesting: { label: 'Rainwater Harvesting Enabled', hint: 'TRUE or FALSE', example: 'TRUE' },
};
const SOC_FIELDS = {
    soc_reportingYear: { label: 'Reporting Year', hint: 'e.g. 2025', example: 2025 },
    soc_totalEmployees: { label: 'Total Employees', hint: 'Total headcount', example: 500 },
    soc_womenEmployees: { label: 'Women Employees', hint: 'Female employee count', example: 210 },
    soc_totalManagers: { label: 'Total Managers', hint: 'All manager-level roles', example: 80 },
    soc_womenManagers: { label: 'Women Managers', hint: 'Female managers', example: 30 },
    soc_employeesJoined: { label: 'Employees Joined', hint: 'New hires in reporting year', example: 60 },
    soc_employeesLeft: { label: 'Employees Left', hint: 'Attrition in reporting year', example: 40 },
    soc_totalTrainingHours: { label: 'Total Training Hours', hint: 'All employee training hours combined', example: 12000 },
    soc_employeeSatisfactionScore: { label: 'Employee Satisfaction Score', hint: 'Score out of 10', example: 7.8 },
    soc_healthInsuranceCovered: { label: 'Health Insurance Covered', hint: 'Employees with health coverage', example: 480 },
    soc_mentalHealthProgramCovered: { label: 'Mental Health Program Covered', hint: 'Employees in mental health programs', example: 300 },
    soc_workplaceInjuries: { label: 'Workplace Injuries', hint: 'Reported incidents in the year', example: 5 },
    soc_totalWorkHours: { label: 'Total Work Hours', hint: 'Sum of all employee work hours', example: 960000 },
    soc_remoteEmployees: { label: 'Remote Employees', hint: 'Employees working remotely', example: 150 },
};
const GOV_FIELDS = {
    gov_reportingYear: { label: 'Reporting Year', hint: 'e.g. 2025', example: 2025 },
    gov_totalBoardMembers: { label: 'Total Board Members', hint: 'Size of the board of directors', example: 12 },
    gov_independentDirectors: { label: 'Independent Directors', hint: 'Non-executive / independent members', example: 7 },
    gov_femaleDirectors: { label: 'Female Directors', hint: 'Women on the board', example: 4 },
    gov_boardMeetings: { label: 'Board Meetings (Annual)', hint: 'Total meetings held in the year', example: 8 },
    gov_independentAttendancePercent: { label: 'Independent Attendance (%)', hint: 'Average attendance rate of ind. directors', example: 92.5 },
    gov_cybersecurityIncidents: { label: 'Cybersecurity Incidents', hint: 'Reported security incidents', example: 2 },
    gov_whistleblowerComplaints: { label: 'Whistleblower Complaints', hint: 'Complaints filed via whistleblower channel', example: 3 },
    gov_complaintsResolved: { label: 'Complaints Resolved', hint: 'Whistleblower complaints resolved', example: 3 },
    gov_antiCorruptionViolations: { label: 'Anti-Corruption Violations', hint: 'Violations of anti-corruption policy', example: 0 },
    gov_dataPrivacyCompliant: { label: 'Data Privacy Compliant', hint: 'TRUE or FALSE (GDPR/local law)', example: 'TRUE' },
    gov_iso27001Certified: { label: 'ISO 27001 Certified', hint: 'TRUE or FALSE', example: 'FALSE' },
};

const ALL_FIELDS = { ...ENV_FIELDS, ...SOC_FIELDS, ...GOV_FIELDS };

const SECTION_GROUPS = [
    { title: '🌿 ENVIRONMENT', fields: ENV_FIELDS },
    { title: '👥 SOCIAL', fields: SOC_FIELDS },
    { title: '🏛️ GOVERNANCE', fields: GOV_FIELDS },
];

// CSV parse helpers
const parseBool = (v) => {
    if (typeof v === 'boolean') return v;
    return typeof v === 'string' ? v.trim().toUpperCase() === 'TRUE' : Boolean(v);
};
const parseValue = (key, raw) => {
    const f = ALL_FIELDS[key];
    if (!f) return raw;
    const n = Number(raw);
    return isNaN(n) ? raw : n;
};
const buildPayload = (row) => {
    const environment = {}, social = {}, governance = {};
    for (const [col, rawVal] of Object.entries(row)) {
        const val = col.includes('Harvesting') || col.includes('Privacy') || col.includes('iso27001')
            ? parseBool(rawVal)
            : parseValue(col, rawVal);
        if (col.startsWith('env_')) environment[col.slice(4)] = val;
        else if (col.startsWith('soc_')) social[col.slice(4)] = val;
        else if (col.startsWith('gov_')) governance[col.slice(4)] = val;
    }
    return { environment, social, governance };
};
const validateCsvRow = (row) => {
    const missing = [];
    for (const key of Object.keys(ALL_FIELDS)) {
        if (row[key] === undefined || row[key] === null || row[key] === '')
            missing.push(ALL_FIELDS[key].label);
    }
    return missing;
};

const downloadTemplate = (type = 'csv') => {
    const wb = XLSX.utils.book_new();
    const wsData = [
        ['Field Key (do NOT edit)', 'Field Label', 'Hint / Description', 'Your Value  ← fill here'],
    ];
    SECTION_GROUPS.forEach(({ title, fields }) => {
        wsData.push([title, '', '', '']);
        Object.entries(fields).forEach(([key, { label, hint, example }]) => {
            wsData.push([key, label, hint, example]);
        });
        wsData.push(['', '', '', '']);
    });
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [{ wch: 38 }, { wch: 34 }, { wch: 46 }, { wch: 24 }];
    ws['!freeze'] = { xSplit: 0, ySplit: 1 };
    XLSX.utils.book_append_sheet(wb, ws, 'ESG_Data');
    if (type === 'xlsx') {
        XLSX.writeFile(wb, 'ESG_Submission_Template.xlsx');
    } else {
        XLSX.writeFile(wb, 'ESG_Submission_Template.csv', { bookType: 'csv' });
    }
};

const ESGSubmitPage = () => {
    // ── Mode: 'manual' | 'csv' ───────────────────────────────────────────────
    const [submitMode, setSubmitMode] = useState('manual');

    // ── CSV upload state ─────────────────────────────────────────────────────
    const fileInputRef = useRef(null);
    const [csvDragOver, setCsvDragOver] = useState(false);
    const [csvFileName, setCsvFileName] = useState('');
    const [csvParsedRow, setCsvParsedRow] = useState(null);
    const [csvValidationErrors, setCsvValidationErrors] = useState([]);
    const [csvParseError, setCsvParseError] = useState('');
    const [csvPreviewOpen, setCsvPreviewOpen] = useState(false);
    const [csvLoading, setCsvLoading] = useState(false);
    const [csvSuccess, setCsvSuccess] = useState('');
    const [csvError, setCsvError] = useState('');
    const [csvFinalScore, setCsvFinalScore] = useState(null);

    const processFile = (file) => {
        setCsvParseError(''); setCsvValidationErrors([]);
        setCsvParsedRow(null); setCsvFinalScore(null);
        setCsvSuccess(''); setCsvError('');
        if (!file) return;
        const ext = file.name.split('.').pop().toLowerCase();
        if (!['csv', 'xlsx', 'xls'].includes(ext)) {
            setCsvParseError('Unsupported file type. Please upload .csv, .xlsx, or .xls.');
            return;
        }
        setCsvFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const wb = XLSX.read(data, { type: 'array' });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
                if (!aoa || aoa.length === 0) {
                    setCsvParseError('File is empty. Please use the downloaded template.');
                    return;
                }
                const headerRow = aoa[0].map(c => String(c).toLowerCase());
                const keyCol = headerRow.findIndex(h => h.includes('field key'));
                const valCol = headerRow.findIndex(h => h.includes('your value') || h.includes('fill here'));
                let dataRow = null;
                if (keyCol !== -1 && valCol !== -1) {
                    const map = {};
                    for (let i = 1; i < aoa.length; i++) {
                        const rowKey = String(aoa[i][keyCol] ?? '').trim();
                        if (rowKey && ALL_FIELDS[rowKey]) map[rowKey] = aoa[i][valCol];
                    }
                    if (Object.keys(map).length > 0) dataRow = map;
                } else {
                    const raw = XLSX.utils.sheet_to_json(ws, { defval: '' });
                    if (raw && raw.length > 0) dataRow = raw[raw.length - 1];
                }
                if (!dataRow) {
                    setCsvParseError('Could not read data. Please use the downloaded template.');
                    return;
                }
                const missing = validateCsvRow(dataRow);
                if (missing.length > 0) setCsvValidationErrors(missing);
                else { setCsvParsedRow(dataRow); setCsvPreviewOpen(true); }
            } catch (err) {
                setCsvParseError('Failed to parse file. Please use the downloaded template.');
                console.error(err);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleCsvSubmit = async () => {
        if (!csvParsedRow) return;
        setCsvLoading(true); setCsvError(''); setCsvSuccess('');
        try {
            const payload = buildPayload(csvParsedRow);
            const response = await api.post('/core/submit-all', payload);
            setCsvFinalScore(response.data);
            setCsvSuccess('ESG Report submitted successfully!');
            setCsvPreviewOpen(false);
        } catch (err) {
            setCsvError(err.response?.data?.message || err.message || 'Submission failed.');
        } finally {
            setCsvLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const resetCsv = () => {
        setCsvParsedRow(null); setCsvFileName(''); setCsvValidationErrors([]);
        setCsvParseError(''); setCsvFinalScore(null); setCsvSuccess(''); setCsvError('');
        setCsvPreviewOpen(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

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
                    {/* ── Mode Switcher ── */}
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginTop: '20px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setSubmitMode('manual')}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '9px',
                                padding: '11px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: 700,
                                fontSize: '0.9rem', transition: 'all 0.22s',
                                background: submitMode === 'manual'
                                    ? 'linear-gradient(135deg,rgba(16,185,129,0.28),rgba(16,185,129,0.1))'
                                    : 'rgba(255,255,255,0.04)',
                                border: submitMode === 'manual' ? '2px solid rgba(16,185,129,0.7)' : '2px solid rgba(255,255,255,0.12)',
                                color: submitMode === 'manual' ? '#6ee7b7' : '#94a3b8',
                                boxShadow: submitMode === 'manual' ? '0 0 18px rgba(16,185,129,0.18)' : 'none'
                            }}
                        >
                            <Play size={15} fill={submitMode === 'manual' ? 'currentColor' : 'none'} /> Fill Manually
                        </button>
                        <button
                            onClick={() => setSubmitMode('csv')}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '9px',
                                padding: '11px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: 700,
                                fontSize: '0.9rem', transition: 'all 0.22s',
                                background: submitMode === 'csv'
                                    ? 'linear-gradient(135deg,rgba(99,102,241,0.28),rgba(99,102,241,0.1))'
                                    : 'rgba(255,255,255,0.04)',
                                border: submitMode === 'csv' ? '2px solid rgba(99,102,241,0.7)' : '2px solid rgba(255,255,255,0.12)',
                                color: submitMode === 'csv' ? '#a5b4fc' : '#94a3b8',
                                boxShadow: submitMode === 'csv' ? '0 0 18px rgba(99,102,241,0.18)' : 'none'
                            }}
                        >
                            <FileSpreadsheet size={15} /> Upload CSV / Excel
                        </button>
                    </motion.div>
                </div>

                {submitMode === 'manual' && (
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
                )}

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

                {submitMode === 'manual' && (
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
                )}

                {/* ═══ CSV / EXCEL UPLOAD MODE ═══ */}
                {submitMode === 'csv' && (
                    <motion.div key="csv-mode" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={styles.formCard}>

                        {/* CSV Alerts */}
                        <AnimatePresence mode="wait">
                            {csvSuccess && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', marginBottom: '16px',
                                        borderRadius: '10px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.4)', color: '#6ee7b7'
                                    }}>
                                    <CheckCircle2 size={16} /> {csvSuccess}
                                </motion.div>
                            )}
                            {csvError && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', marginBottom: '16px',
                                        borderRadius: '10px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5'
                                    }}>
                                    <AlertCircle size={16} /> {csvError}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* CSV Final Score */}
                        {csvFinalScore && (
                            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                className={styles.successCardContainer}>
                                <div className={styles.successCardGlow} />
                                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                                    className={styles.successIconContainer}>
                                    <Award size={48} />
                                </motion.div>
                                <h2 className={styles.successTitle}>Report Submitted Successfully</h2>
                                <p className={styles.successSubtitle}>Your ESG data for {csvFinalScore.reportingYear} has been computed against your benchmarks.</p>
                                <div className={styles.scoreCardsContainer}>
                                    <div className={styles.scoreCard}>
                                        <div className={styles.scoreCardLabel}>Total Score</div>
                                        <div className={`${styles.scoreCardValue} ${styles.scoreCardValueTotal}`}>
                                            {Math.round(csvFinalScore.totalEsgScore)}<span className={styles.scoreMax}>/100</span>
                                        </div>
                                    </div>
                                    <div className={styles.scoreCard}>
                                        <div className={styles.scoreCardLabel}>Rating</div>
                                        <div className={`${styles.scoreCardValue} ${styles.scoreCardValueRating}`} style={{
                                            color: csvFinalScore.rating === 'A' ? '#34d399' : csvFinalScore.rating === 'B' ? '#facc15' : '#f87171'
                                        }}>{csvFinalScore.rating}</div>
                                    </div>
                                </div>
                                <div style={{ position: 'relative', zIndex: 10, display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <button onClick={resetCsv} className={styles.prevBtn}>Upload Another File</button>
                                    <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                                        <button className={styles.backToDashboardBtn}>Back to Dashboard <ArrowRight size={18} /></button>
                                    </Link>
                                </div>
                            </motion.div>
                        )}

                        {!csvFinalScore && (<>

                            {/* ── Step 1: Download Template ── */}
                            <div className={styles.formContainer} style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                    <div style={{
                                        width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#6ee7b7,#10b981)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', color: '#fff', flexShrink: 0
                                    }}>1</div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.97rem', color: '#e2e8f0' }}>Download the Template</p>
                                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>Fill Column D with your data. Do not rename Column A keys.</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                    <button onClick={() => downloadTemplate('csv')} style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                                        borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                                        background: 'linear-gradient(135deg,rgba(16,185,129,0.18),rgba(16,185,129,0.06))',
                                        border: '1px solid rgba(16,185,129,0.45)', color: '#6ee7b7', transition: 'all 0.2s'
                                    }}><Download size={15} /> Download CSV Template</button>
                                    <button onClick={() => downloadTemplate('xlsx')} style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                                        borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                                        background: 'linear-gradient(135deg,rgba(99,102,241,0.18),rgba(99,102,241,0.06))',
                                        border: '1px solid rgba(99,102,241,0.45)', color: '#a5b4fc', transition: 'all 0.2s'
                                    }}><FileSpreadsheet size={15} /> Download Excel Template (.xlsx)</button>
                                </div>
                            </div>

                            {/* ── Step 2: Upload File ── */}
                            <div className={styles.formContainer} style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                    <div style={{
                                        width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#a5b4fc,#6366f1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', color: '#fff', flexShrink: 0
                                    }}>2</div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.97rem', color: '#e2e8f0' }}>Upload Your Filled File</p>
                                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>Supports .csv, .xlsx, .xls</p>
                                    </div>
                                </div>
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setCsvDragOver(true); }}
                                    onDragLeave={() => setCsvDragOver(false)}
                                    onDrop={(e) => { e.preventDefault(); setCsvDragOver(false); processFile(e.dataTransfer.files[0]); }}
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        border: `2px dashed ${csvDragOver ? 'rgba(99,102,241,0.8)' : csvFileName ? 'rgba(16,185,129,0.6)' : 'rgba(148,163,184,0.3)'}`,
                                        borderRadius: '14px', padding: '36px 24px', textAlign: 'center',
                                        cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none',
                                        background: csvDragOver ? 'rgba(99,102,241,0.07)' : csvFileName ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)'
                                    }}>
                                    <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls"
                                        style={{ display: 'none' }} onChange={(e) => processFile(e.target.files[0])} />
                                    {csvFileName ? (
                                        <div>
                                            <FileSpreadsheet size={36} style={{ color: '#6ee7b7', margin: '0 auto 10px' }} />
                                            <p style={{ margin: 0, fontWeight: 600, color: '#e2e8f0' }}>{csvFileName}</p>
                                            <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#64748b' }}>Click or drop to replace</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <Upload size={36} style={{ color: '#64748b', margin: '0 auto 10px' }} />
                                            <p style={{ margin: 0, fontWeight: 600, color: '#94a3b8' }}>Drag &amp; drop your filled file here</p>
                                            <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#475569' }}>or click to browse &nbsp;·&nbsp; .csv &nbsp;·&nbsp; .xlsx &nbsp;·&nbsp; .xls</p>
                                        </div>
                                    )}
                                </div>

                                {csvParseError && (
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', padding: '10px 14px',
                                        borderRadius: '9px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)', color: '#fca5a5', fontSize: '0.85rem'
                                    }}>
                                        <AlertCircle size={15} /> {csvParseError}
                                    </div>
                                )}
                                {csvValidationErrors.length > 0 && (
                                    <div style={{
                                        marginTop: '12px', padding: '12px 16px', borderRadius: '9px',
                                        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)'
                                    }}>
                                        <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#fca5a5', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <AlertCircle size={14} /> {csvValidationErrors.length} missing field{csvValidationErrors.length > 1 ? 's' : ''}:
                                        </p>
                                        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: '#f87171', lineHeight: 1.9 }}>
                                            {csvValidationErrors.map((e, index) => <li key={index}>{e}</li>)}
                                        </ul>
                                    </div>
                                )}
                                {csvParsedRow && !csvPreviewOpen && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '14px', flexWrap: 'wrap' }}>
                                        <div style={{
                                            flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px',
                                            borderRadius: '9px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.35)', color: '#6ee7b7', fontSize: '0.85rem'
                                        }}>
                                            <CheckCircle2 size={15} /> File parsed — {Object.keys(ALL_FIELDS).length} fields ready.
                                        </div>
                                        <button onClick={() => setCsvPreviewOpen(true)} style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 18px',
                                            borderRadius: '9px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                                            background: 'linear-gradient(135deg,rgba(99,102,241,0.25),rgba(99,102,241,0.1))',
                                            border: '1px solid rgba(99,102,241,0.5)', color: '#a5b4fc'
                                        }}><Eye size={14} /> Preview &amp; Submit</button>
                                    </div>
                                )}
                            </div>

                            {/* ── Step 3: Preview & Submit ── */}
                            <AnimatePresence>
                                {csvParsedRow && csvPreviewOpen && (
                                    <motion.div key="csv-preview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        className={styles.formContainer}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{
                                                    width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', color: '#fff'
                                                }}>3</div>
                                                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.97rem', color: '#e2e8f0' }}>Review &amp; Submit</p>
                                            </div>
                                            <button onClick={() => setCsvPreviewOpen(false)} style={{
                                                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                                                borderRadius: '7px', padding: '5px 8px', cursor: 'pointer', color: '#94a3b8'
                                            }}><X size={15} /></button>
                                        </div>

                                        {/* ENV preview */}
                                        {[{ title: '🌿 Environment', fields: ENV_FIELDS, color: '#6ee7b7' },
                                        { title: '👥 Social', fields: SOC_FIELDS, color: '#93c5fd' },
                                        { title: '🏛️ Governance', fields: GOV_FIELDS, color: '#c4b5fd' }
                                        ].map(({ title, fields, color }) => (
                                            <div key={title} style={{ marginBottom: '16px' }}>
                                                <p style={{ margin: '0 0 8px', fontWeight: 700, fontSize: '0.83rem', color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</p>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '6px' }}>
                                                    {Object.entries(fields).map(([key, { label }]) => (
                                                        <div key={key} style={{
                                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                            padding: '6px 10px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)',
                                                            border: '1px solid rgba(255,255,255,0.07)', gap: '8px'
                                                        }}>
                                                            <span style={{ fontSize: '0.76rem', color: '#94a3b8', flexShrink: 0 }}>{label}</span>
                                                            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0', textAlign: 'right' }}>
                                                                {csvParsedRow?.[key]?.toString() ?? '—'}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}

                                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px', flexWrap: 'wrap' }}>
                                            <button onClick={resetCsv} className={styles.prevBtn} disabled={csvLoading}>
                                                <X size={14} /> Cancel
                                            </button>
                                            <button onClick={handleCsvSubmit} className={styles.submitAllBtn} disabled={csvLoading}>
                                                {csvLoading
                                                    ? <><Loader2 size={16} className="animate-spin" /> Submitting…</>
                                                    : <><CheckCircle2 size={16} /> Submit ESG Report</>}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </>)}
                    </motion.div>
                )}

            </div>
        </section>
    );
};

export default ESGSubmitPage;
