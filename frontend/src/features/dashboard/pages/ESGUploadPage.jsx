import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import {
    Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle,
    Loader2, ArrowRight, Award, Eye, X, Leaf, Users, Shield, Info
} from 'lucide-react';
import api from '../../../utils/api';
import styles from './ESGUploadPage.module.css';

// ─── Field definitions ─────────────────────────────────────────────────────
const ENV_FIELDS = {
    env_reportingYear: { label: 'Reporting Year', type: 'number', example: 2025, hint: 'e.g. 2025' },
    env_totalElectricityKwh: { label: 'Total Electricity (kWh)', type: 'number', example: 500000, hint: 'Annual consumption in kWh' },
    env_officeAreaSqm: { label: 'Office Area (sqm)', type: 'number', example: 2000, hint: 'Total office floor area in m²' },
    env_dieselUsedLiters: { label: 'Diesel Used (Liters)', type: 'number', example: 3000, hint: 'Annual diesel consumption' },
    env_renewableEnergyKwh: { label: 'Renewable Energy (kWh)', type: 'number', example: 150000, hint: 'Solar/wind energy consumed' },
    env_dataCenterTotalEnergyKwh: { label: 'Data Center Total Energy (kWh)', type: 'number', example: 80000, hint: 'Total data center energy' },
    env_dataCenterItEnergyKwh: { label: 'Data Center IT Energy (kWh)', type: 'number', example: 60000, hint: 'IT equipment energy only' },
    env_totalWaterLiters: { label: 'Total Water (Liters)', type: 'number', example: 1000000, hint: 'Annual water consumption' },
    env_recycledWaterLiters: { label: 'Recycled Water (Liters)', type: 'number', example: 200000, hint: 'Recycled/harvested water used' },
    env_totalEmployees: { label: 'Total Employees (Env)', type: 'number', example: 500, hint: 'Headcount for env. calculations' },
    env_ewasteGenerated: { label: 'E-Waste Generated (kg)', type: 'number', example: 1200, hint: 'Total electronic waste produced' },
    env_ewasteRecycled: { label: 'E-Waste Recycled (kg)', type: 'number', example: 900, hint: 'Amount recycled or refurbished' },
    env_electricityEmissionFactor: { label: 'Electricity Emission Factor (kgCO2/kWh)', type: 'number', example: 0.82, hint: 'Grid emission factor for your region' },
    env_dieselEmissionFactor: { label: 'Diesel Emission Factor (kgCO2/L)', type: 'number', example: 2.68, hint: 'Standard: 2.68 kgCO2/liter' },
    env_rainwaterHarvesting: { label: 'Rainwater Harvesting Enabled', type: 'boolean', example: 'TRUE', hint: 'TRUE or FALSE' },
};

const SOC_FIELDS = {
    soc_reportingYear: { label: 'Reporting Year', type: 'number', example: 2025, hint: 'e.g. 2025' },
    soc_totalEmployees: { label: 'Total Employees', type: 'number', example: 500, hint: 'Total headcount' },
    soc_womenEmployees: { label: 'Women Employees', type: 'number', example: 210, hint: 'Female employee count' },
    soc_totalManagers: { label: 'Total Managers', type: 'number', example: 80, hint: 'All manager-level roles' },
    soc_womenManagers: { label: 'Women Managers', type: 'number', example: 30, hint: 'Female managers' },
    soc_employeesJoined: { label: 'Employees Joined', type: 'number', example: 60, hint: 'New hires in reporting year' },
    soc_employeesLeft: { label: 'Employees Left', type: 'number', example: 40, hint: 'Attrition in reporting year' },
    soc_totalTrainingHours: { label: 'Total Training Hours', type: 'number', example: 12000, hint: 'All employee training hours combined' },
    soc_employeeSatisfactionScore: { label: 'Employee Satisfaction Score', type: 'number', example: 7.8, hint: 'Score out of 10' },
    soc_healthInsuranceCovered: { label: 'Health Insurance Covered', type: 'number', example: 480, hint: 'Employees with health coverage' },
    soc_mentalHealthProgramCovered: { label: 'Mental Health Program Covered', type: 'number', example: 300, hint: 'Employees in mental health programs' },
    soc_workplaceInjuries: { label: 'Workplace Injuries', type: 'number', example: 5, hint: 'Reported incidents in the year' },
    soc_totalWorkHours: { label: 'Total Work Hours', type: 'number', example: 960000, hint: 'Sum of all employee work hours' },
    soc_remoteEmployees: { label: 'Remote Employees', type: 'number', example: 150, hint: 'Employees working remotely' },
};

const GOV_FIELDS = {
    gov_reportingYear: { label: 'Reporting Year', type: 'number', example: 2025, hint: 'e.g. 2025' },
    gov_totalBoardMembers: { label: 'Total Board Members', type: 'number', example: 12, hint: 'Size of the board of directors' },
    gov_independentDirectors: { label: 'Independent Directors', type: 'number', example: 7, hint: 'Non-executive / independent members' },
    gov_femaleDirectors: { label: 'Female Directors', type: 'number', example: 4, hint: 'Women on the board' },
    gov_boardMeetings: { label: 'Board Meetings (Annual)', type: 'number', example: 8, hint: 'Total meetings held in the year' },
    gov_independentAttendancePercent: { label: 'Independent Attendance (%)', type: 'number', example: 92.5, hint: 'Average attendance rate of ind. directors' },
    gov_cybersecurityIncidents: { label: 'Cybersecurity Incidents', type: 'number', example: 2, hint: 'Reported security incidents' },
    gov_whistleblowerComplaints: { label: 'Whistleblower Complaints', type: 'number', example: 3, hint: 'Complaints filed via whistleblower channel' },
    gov_complaintsResolved: { label: 'Complaints Resolved', type: 'number', example: 3, hint: 'Whistleblower complaints resolved' },
    gov_antiCorruptionViolations: { label: 'Anti-Corruption Violations', type: 'number', example: 0, hint: 'Violations of anti-corruption policy' },
    gov_dataPrivacyCompliant: { label: 'Data Privacy Compliant', type: 'boolean', example: 'TRUE', hint: 'TRUE or FALSE (GDPR/local law)' },
    gov_iso27001Certified: { label: 'ISO 27001 Certified', type: 'boolean', example: 'FALSE', hint: 'TRUE or FALSE' },
};

const ALL_FIELDS = { ...ENV_FIELDS, ...SOC_FIELDS, ...GOV_FIELDS };

// ─── Helpers ───────────────────────────────────────────────────────────────
const parseBool = (v) => {
    if (typeof v === 'boolean') return v;
    return typeof v === 'string' ? v.trim().toUpperCase() === 'TRUE' : Boolean(v);
};

const parseValue = (key, raw) => {
    const f = ALL_FIELDS[key];
    if (!f) return raw;
    if (f.type === 'boolean') return parseBool(raw);
    const n = Number(raw);
    return isNaN(n) ? raw : n;
};

const buildPayload = (row) => {
    const environment = {}, social = {}, governance = {};
    for (const [col, rawVal] of Object.entries(row)) {
        const val = parseValue(col, rawVal);
        if (col.startsWith('env_')) environment[col.slice(4)] = val;
        else if (col.startsWith('soc_')) social[col.slice(4)] = val;
        else if (col.startsWith('gov_')) governance[col.slice(4)] = val;
    }
    return { environment, social, governance };
};

const validateRow = (row) => {
    const missing = [];
    for (const key of Object.keys(ALL_FIELDS)) {
        if (row[key] === undefined || row[key] === null || row[key] === '')
            missing.push(ALL_FIELDS[key].label);
    }
    return missing;
};

// ─── Template generator (horizontal / row-per-field layout) ────────────────
const SECTION_GROUPS = [
    { title: '🌿 ENVIRONMENT', fields: ENV_FIELDS },
    { title: '👥 SOCIAL', fields: SOC_FIELDS },
    { title: '🏛️ GOVERNANCE', fields: GOV_FIELDS },
];

const downloadTemplate = (type = 'csv') => {
    const wb = XLSX.utils.book_new();

    // ── Header row ──────────────────────────────────────────────────────────
    const wsData = [
        ['Field Key (do NOT edit)', 'Field Label', 'Hint / Description', 'Your Value  ← fill here'],
    ];

    // ── One row per field, grouped by section with a blank separator ────────
    SECTION_GROUPS.forEach(({ title, fields }) => {
        // Section header row (spans all 4 columns visually)
        wsData.push([title, '', '', '']);
        Object.entries(fields).forEach(([key, { label, hint, example }]) => {
            wsData.push([key, label, hint, example]);
        });
        wsData.push(['', '', '', '']); // blank separator between sections
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Column widths: key | label | hint | value
    ws['!cols'] = [{ wch: 38 }, { wch: 34 }, { wch: 46 }, { wch: 24 }];

    // Freeze header row so it stays visible while scrolling
    ws['!freeze'] = { xSplit: 0, ySplit: 1 };

    XLSX.utils.book_append_sheet(wb, ws, 'ESG_Data');

    if (type === 'xlsx') {
        XLSX.writeFile(wb, 'ESG_Submission_Template.xlsx');
    } else {
        XLSX.writeFile(wb, 'ESG_Submission_Template.csv', { bookType: 'csv' });
    }
};

// ─── PreviewSection component ──────────────────────────────────────────────
const PreviewSection = ({ title, colorClass, icon: Icon, keys, parsedRow }) => (
    <div className={styles.previewSection}>
        <div className={`${styles.previewSectionHeader} ${styles[colorClass]}`}>
            <Icon size={14} /> {title}
        </div>
        <div className={styles.previewGrid}>
            {keys.map(key => (
                <div key={key} className={styles.previewItem}>
                    <span className={styles.previewLabel}>{ALL_FIELDS[key]?.label}</span>
                    <span className={styles.previewValue}>{parsedRow?.[key]?.toString() ?? '—'}</span>
                </div>
            ))}
        </div>
    </div>
);

// ─── Main component ────────────────────────────────────────────────────────
const ESGUploadPage = () => {
    const [dragOver, setDragOver] = useState(false);
    const [fileName, setFileName] = useState('');
    const [parsedRow, setParsedRow] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);
    const [parseError, setParseError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [finalScore, setFinalScore] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const fileInputRef = useRef(null);

    // ── Process uploaded file ──────────────────────────────────────────
    const processFile = (file) => {
        setParseError(''); setValidationErrors([]);
        setParsedRow(null); setFinalScore(null);
        setSuccessMsg(''); setErrorMsg('');
        if (!file) return;

        const ext = file.name.split('.').pop().toLowerCase();
        if (!['csv', 'xlsx', 'xls'].includes(ext)) {
            setParseError('Unsupported file type. Please upload .csv, .xlsx, or .xls.');
            return;
        }
        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const wb = XLSX.read(data, { type: 'array' });
                const ws = wb.Sheets[wb.SheetNames[0]];

                // Parse as array-of-arrays so we can handle both layouts
                const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

                if (!aoa || aoa.length === 0) {
                    setParseError('File is empty or has no data rows. Please use the provided template.');
                    return;
                }

                // ── Try horizontal (row-per-field) format first ──────────────
                // Header row should have 'Field Key' in column 0 and 'Your Value' in column 3
                const headerRow = aoa[0].map(c => String(c).toLowerCase());
                const keyCol = headerRow.findIndex(h => h.includes('field key'));
                const valCol = headerRow.findIndex(h => h.includes('your value') || h.includes('fill here'));

                let dataRow = null;

                if (keyCol !== -1 && valCol !== -1) {
                    // Horizontal template: build key→value map from each data row
                    const map = {};
                    for (let i = 1; i < aoa.length; i++) {
                        const rowKey = String(aoa[i][keyCol] ?? '').trim();
                        if (rowKey && ALL_FIELDS[rowKey]) {
                            map[rowKey] = aoa[i][valCol];
                        }
                    }
                    if (Object.keys(map).length > 0) dataRow = map;
                } else {
                    // Fallback: legacy wide (column-per-field) format
                    // The first row is treated as headers by sheet_to_json
                    const raw = XLSX.utils.sheet_to_json(ws, { defval: '' });
                    if (raw && raw.length > 0) {
                        dataRow = raw[raw.length - 1];
                    }
                }

                if (!dataRow) {
                    setParseError('Could not read data from the file. Please use the downloaded template.');
                    return;
                }

                const missing = validateRow(dataRow);
                if (missing.length > 0) {
                    setValidationErrors(missing);
                } else {
                    setParsedRow(dataRow);
                    setPreviewOpen(true);
                }
            } catch (err) {
                setParseError('Failed to parse the file. Please use the downloaded template without modifying column headers.');
                console.error(err);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleFileChange = (e) => processFile(e.target.files[0]);
    const handleDrop = (e) => {
        e.preventDefault(); setDragOver(false);
        processFile(e.dataTransfer.files[0]);
    };

    // ── Submit ──────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!parsedRow) return;
        setLoading(true); setErrorMsg(''); setSuccessMsg('');
        try {
            const payload = buildPayload(parsedRow);
            const response = await api.post('/core/submit-all', payload);
            setFinalScore(response.data);
            setSuccessMsg('ESG Report submitted successfully!');
            setPreviewOpen(false);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || err.message || 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const resetAll = () => {
        setParsedRow(null); setFileName('');
        setValidationErrors([]); setParseError('');
        setFinalScore(null); setSuccessMsg(''); setErrorMsg('');
        setPreviewOpen(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <section className={styles.page}>
            <div className={styles.gridBackground}></div>
            <div className={`${styles.decorativeSphere} ${styles.sphere1}`}></div>
            <div className={`${styles.decorativeSphere} ${styles.sphere2}`}></div>

            <div className={styles.container}>

                {/* ── Header ── */}
                <div className={styles.header}>
                    <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={styles.title}>
                        Upload ESG Data
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={styles.subtitle}>
                        Submit Environmental, Social &amp; Governance data via a single CSV or Excel file.
                    </motion.p>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                        <div className={styles.uploadBadge}>
                            <Info size={13} />
                            {Object.keys(ALL_FIELDS).length} required fields · Download template → Fill data → Upload &amp; Submit
                        </div>
                    </motion.div>
                </div>

                {/* ── Alerts ── */}
                <AnimatePresence mode="wait">
                    {successMsg && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={styles.alertSuccess}>
                            <CheckCircle2 size={18} /> {successMsg}
                        </motion.div>
                    )}
                    {errorMsg && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={styles.alertError}>
                            <AlertCircle size={18} /> {errorMsg}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Success / Score Card ── */}
                {finalScore && (
                    <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={styles.scoreCard}>
                        <div className={styles.scoreCardGlow}></div>
                        <div className={styles.scoreIconWrap}><Award size={46} /></div>
                        <h2 className={styles.scoreTitle}>Report Submitted Successfully</h2>
                        <p className={styles.scoreSubtitle}>
                            Your ESG data for {finalScore.reportingYear} has been computed against your benchmarks.
                        </p>
                        <div className={styles.scoreBadges}>
                            <div className={styles.scoreBadge}>
                                <div className={styles.scoreBadgeLabel}>Total ESG Score</div>
                                <div className={`${styles.scoreBadgeValue} ${styles.scoreTotal}`}>
                                    {Math.round(finalScore.totalEsgScore)}<span>/100</span>
                                </div>
                            </div>
                            <div className={styles.scoreBadge}>
                                <div className={styles.scoreBadgeLabel}>Rating</div>
                                <div className={styles.scoreBadgeValue} style={{
                                    color: finalScore.rating === 'A' ? '#34d399'
                                        : finalScore.rating === 'B' ? '#facc15' : '#f87171',
                                    textShadow: '0 4px 20px currentColor'
                                }}>
                                    {finalScore.rating}
                                </div>
                            </div>
                        </div>
                        <div className={styles.scoreActions}>
                            <button className={styles.resetBtn} onClick={resetAll}>Upload Another File</button>
                            <Link to="/dashboard">
                                <button className={styles.dashBtn}>Back to Dashboard <ArrowRight size={16} /></button>
                            </Link>
                        </div>
                    </motion.div>
                )}

                {!finalScore && (<>

                    {/* ── Step 1: Download Template ── */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.stepBadge}>1</div>
                            <div>
                                <h2 className={styles.cardTitle}>Download Template</h2>
                                <p className={styles.cardSub}>
                                    Get the pre-formatted file with all column headers, descriptions, and sample data. Do NOT rename the columns in Row 1.
                                </p>
                            </div>
                        </div>

                        <div className={styles.templateBtns}>
                            <button className={styles.templateBtnCsv} onClick={() => downloadTemplate('csv')}>
                                <Download size={15} /> Download CSV Template
                            </button>
                            <button className={styles.templateBtnXlsx} onClick={() => downloadTemplate('xlsx')}>
                                <FileSpreadsheet size={15} /> Download Excel Template (.xlsx)
                            </button>
                        </div>

                        {/* How to fill guide */}
                        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 16px', marginBottom: '18px' }}>
                            <p style={{ margin: 0, fontSize: '0.82rem', color: '#92400e', fontWeight: 600, marginBottom: '6px' }}>
                                📋 How to fill the template:
                            </p>
                            <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8rem', color: '#78350f', lineHeight: 1.8 }}>
                                <li><strong>Column A</strong> — Field keys (do NOT edit these)</li>
                                <li><strong>Column B</strong> — Human-readable field names (for reference)</li>
                                <li><strong>Column C</strong> — Hints and unit descriptions (for reference)</li>
                                <li><strong>Column D ← Your Value</strong> — Replace the sample values with your actual data</li>
                            </ol>
                        </div>

                        {/* Field reference accordion */}
                        <details className={styles.fieldRef}>
                            <summary className={styles.fieldRefSummary}>
                                <Eye size={13} /> View all {Object.keys(ALL_FIELDS).length} required columns
                            </summary>
                            <div className={styles.fieldRefBody}>
                                {/* Environment */}
                                <div className={styles.fieldGroup}>
                                    <div className={`${styles.fieldGroupTitle} ${styles.env}`}>
                                        <Leaf size={12} /> Environment — {Object.keys(ENV_FIELDS).length} columns
                                    </div>
                                    {Object.entries(ENV_FIELDS).map(([key, { label, type, hint }]) => (
                                        <div key={key} className={styles.fieldRow}>
                                            <code className={styles.fieldKey}>{key}</code>
                                            <span className={styles.fieldLabel}>{label} <em style={{ color: '#94a3b8', fontSize: '0.75rem' }}>({hint})</em></span>
                                            <span className={styles.fieldType}>{type}</span>
                                        </div>
                                    ))}
                                </div>
                                {/* Social */}
                                <div className={styles.fieldGroup}>
                                    <div className={`${styles.fieldGroupTitle} ${styles.soc}`}>
                                        <Users size={12} /> Social — {Object.keys(SOC_FIELDS).length} columns
                                    </div>
                                    {Object.entries(SOC_FIELDS).map(([key, { label, type, hint }]) => (
                                        <div key={key} className={styles.fieldRow}>
                                            <code className={styles.fieldKey}>{key}</code>
                                            <span className={styles.fieldLabel}>{label} <em style={{ color: '#94a3b8', fontSize: '0.75rem' }}>({hint})</em></span>
                                            <span className={styles.fieldType}>{type}</span>
                                        </div>
                                    ))}
                                </div>
                                {/* Governance */}
                                <div className={styles.fieldGroup}>
                                    <div className={`${styles.fieldGroupTitle} ${styles.gov}`}>
                                        <Shield size={12} /> Governance — {Object.keys(GOV_FIELDS).length} columns
                                    </div>
                                    {Object.entries(GOV_FIELDS).map(([key, { label, type, hint }]) => (
                                        <div key={key} className={styles.fieldRow}>
                                            <code className={styles.fieldKey}>{key}</code>
                                            <span className={styles.fieldLabel}>{label} <em style={{ color: '#94a3b8', fontSize: '0.75rem' }}>({hint})</em></span>
                                            <span className={styles.fieldType}>{type}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </details>
                    </motion.div>

                    {/* ── Step 2: Upload File ── */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.stepBadge}>2</div>
                            <div>
                                <h2 className={styles.cardTitle}>Upload Your Filled File</h2>
                                <p className={styles.cardSub}>Supports .csv, .xlsx, .xls — fill Column D of the template with your values, then upload.</p>
                            </div>
                        </div>

                        <div
                            className={`${styles.dropzone} ${dragOver ? styles.dropzoneActive : ''} ${fileName ? styles.dropzoneFilled : ''}`}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls"
                                style={{ display: 'none' }} onChange={handleFileChange} />
                            {fileName ? (
                                <div className={styles.fileSelected}>
                                    <FileSpreadsheet size={38} className={styles.fileIcon} />
                                    <span className={styles.fileName}>{fileName}</span>
                                    <span className={styles.fileReplaceHint}>Click or drop to replace</span>
                                </div>
                            ) : (
                                <div className={styles.dropzoneContent}>
                                    <Upload size={40} className={styles.uploadIcon} />
                                    <p className={styles.dropzoneText}>Drag &amp; drop your file here</p>
                                    <p className={styles.dropzoneOr}>or <span>click to browse</span></p>
                                    <p className={styles.dropzoneFormats}>.csv &nbsp;·&nbsp; .xlsx &nbsp;·&nbsp; .xls</p>
                                </div>
                            )}
                        </div>

                        {parseError && (
                            <div className={styles.alertError} style={{ marginTop: '14px' }}>
                                <AlertCircle size={16} /> {parseError}
                            </div>
                        )}

                        {validationErrors.length > 0 && (
                            <div className={styles.validationBox}>
                                <p className={styles.validationTitle}>
                                    <AlertCircle size={15} /> {validationErrors.length} missing or empty field{validationErrors.length > 1 ? 's' : ''}:
                                </p>
                                <ul className={styles.validationList}>
                                    {validationErrors.map((e, index) => <li key={index}>{e}</li>)}
                                </ul>
                            </div>
                        )}

                        {parsedRow && !previewOpen && (
                            <div className={styles.parsedActions}>
                                <div className={styles.alertSuccess} style={{ flex: 1 }}>
                                    <CheckCircle2 size={16} />
                                    File parsed — {Object.keys(ALL_FIELDS).length} fields ready for review.
                                </div>
                                <button className={styles.previewBtn} onClick={() => setPreviewOpen(true)}>
                                    <Eye size={15} /> Preview &amp; Submit
                                </button>
                            </div>
                        )}
                    </motion.div>

                    {/* ── Step 3: Preview & Confirm ── */}
                    <AnimatePresence>
                        {parsedRow && previewOpen && (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={styles.card}
                            >
                                <div className={styles.cardHeader}>
                                    <div className={styles.stepBadge}>3</div>
                                    <div style={{ flex: 1 }}>
                                        <h2 className={styles.cardTitle}>Review &amp; Submit</h2>
                                        <p className={styles.cardSub}>Verify your data before sending to the ESG engine.</p>
                                    </div>
                                    <button className={styles.closePreviewBtn} onClick={() => setPreviewOpen(false)}>
                                        <X size={16} />
                                    </button>
                                </div>

                                <PreviewSection title="Environment" colorClass="env" icon={Leaf} keys={Object.keys(ENV_FIELDS)} parsedRow={parsedRow} />
                                <PreviewSection title="Social" colorClass="soc" icon={Users} keys={Object.keys(SOC_FIELDS)} parsedRow={parsedRow} />
                                <PreviewSection title="Governance" colorClass="gov" icon={Shield} keys={Object.keys(GOV_FIELDS)} parsedRow={parsedRow} />

                                <div className={styles.submitRow}>
                                    <button className={styles.cancelBtn} onClick={resetAll} disabled={loading}>
                                        <X size={14} /> Cancel
                                    </button>
                                    <button className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
                                        {loading
                                            ? <><Loader2 size={16} className={styles.spin} /> Submitting…</>
                                            : <><CheckCircle2 size={16} /> Submit ESG Report</>}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </>)}

                {/* Footer */}
                <div className={styles.footerNav}>
                    <Link to="/submit-esg" className={styles.footerLink}>← Fill out the form manually instead</Link>
                </div>

            </div>
        </section>
    );
};

export default ESGUploadPage;
