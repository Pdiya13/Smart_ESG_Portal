import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import {
    Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle,
    Loader2, ArrowRight, Eye, X, Leaf, Users, Shield, Info, Target
} from 'lucide-react';
import api from '../../../utils/api';
import styles from './BenchmarkUploadPage.module.css';

// ─── Benchmark Field definitions ───────────────────────────────────────────
const ENV_BENCH_FIELDS = {
    EUI: { label: 'Energy Use Intensity (EUI)', type: 'number', example: 250, hint: 'Target annual kWh per sqm' },
    RENEWABLE_PERCENT: { label: 'Renewable Energy (%)', type: 'number', example: 40, hint: 'Target percentage of energy from renewables' },
    PUE: { label: 'Power Usage Effectiveness (PUE)', type: 'number', example: 1.5, hint: 'Target PUE for data centers' },
    WATER_PER_EMP: { label: 'Water Intensity (L/Employee)', type: 'number', example: 1500, hint: 'Target annual liters per employee' },
    EWASTE_RECYCLE: { label: 'E-Waste Recycling (%)', type: 'number', example: 85, hint: 'Target percentage of e-waste recycled' },
    CARBON_INTENSITY: { label: 'Carbon Intensity (kgCO2/Employee)', type: 'number', example: 2000, hint: 'Target emissions per employee' },
};

const SOC_BENCH_FIELDS = {
    WOMEN_WORKFORCE: { label: 'Women in Workforce (%)', type: 'number', example: 45, hint: 'Target female employee percentage' },
    WOMEN_LEADERSHIP: { label: 'Women in Leadership (%)', type: 'number', example: 35, hint: 'Target female management percentage' },
    ATTRITION: { label: 'Attrition Rate (%)', type: 'number', example: 10, hint: 'Max target annual attrition' },
    TRAINING: { label: 'Training Hours (Avg/Employee)', type: 'number', example: 30, hint: 'Target annual training hours per employee' },
    SATISFACTION: { label: 'Employee Satisfaction (Out of 10)', type: 'number', example: 8.5, hint: 'Target satisfaction score' },
    INSURANCE: { label: 'Health Insurance Coverage (%)', type: 'number', example: 100, hint: 'Target percentage of employees covered' },
    LTIFR: { label: 'Lost Time Injury Freq. Rate (LTIFR)', type: 'number', example: 0.5, hint: 'Max target injury rate' },
    MENTAL_HEALTH: { label: 'Mental Health Program Enrollment (%)', type: 'number', example: 60, hint: 'Target enrollment percentage' },
};

const GOV_BENCH_FIELDS = {
    ATTENDANCE: { label: 'Board Meeting Attendance (%)', type: 'number', example: 95, hint: 'Target average attendance rate' },
    BOARD_MEETINGS: { label: 'Board Meetings (Annual Count)', type: 'number', example: 8, hint: 'Standard annual meeting count' },
    FEMALE_DIRECTORS: { label: 'Women on Board (%)', type: 'number', example: 33, hint: 'Target percentage of female directors' },
    DATA_PRIVACY: { label: 'Data Privacy Compliant', type: 'boolean', example: 'TRUE', hint: 'TRUE or FALSE' },
    ISO_27001: { label: 'ISO 27001 Certified', type: 'boolean', example: 'TRUE', hint: 'TRUE or FALSE' },
    CYBER_INCIDENTS: { label: 'Max Cybersecurity Incidents', example: 0, hint: 'Maximum acceptable incidents' },
    WHISTLEBLOWER_RESOLUTION: { label: 'Whistleblower Resolution (%)', type: 'number', example: 100, hint: 'Target complaints resolved' },
    ANTI_CORRUPTION: { label: 'Anti-Corruption Violations', example: 0, hint: 'Max target violations' },
    BOARD_INDEPENDENCE: { label: 'Independent Directors (%)', type: 'number', example: 50, hint: 'Target independent directors percentage' },
};

const ALL_BENCH_FIELDS = { ...ENV_BENCH_FIELDS, ...SOC_BENCH_FIELDS, ...GOV_BENCH_FIELDS };

// ─── Helpers ───────────────────────────────────────────────────────────────
const parseBool = (v) => {
    if (typeof v === 'boolean') return v;
    return typeof v === 'string' ? v.trim().toUpperCase() === 'TRUE' : Boolean(v);
};

const parseValue = (key, raw) => {
    const f = ALL_BENCH_FIELDS[key];
    if (!f) return raw;
    if (f.type === 'boolean') return parseBool(raw);
    const n = Number(raw);
    return isNaN(n) ? raw : n;
};

const validateRow = (row) => {
    const missing = [];
    for (const key of Object.keys(ALL_BENCH_FIELDS)) {
        if (row[key] === undefined || row[key] === null || row[key] === '')
            missing.push(ALL_BENCH_FIELDS[key].label);
    }
    return missing;
};

// ─── Template generator ──────────────────────────────────────────────────
const SECTION_GROUPS = [
    { title: '🌿 ENVIRONMENT BENCHMARKS', fields: ENV_BENCH_FIELDS },
    { title: '👥 SOCIAL BENCHMARKS', fields: SOC_BENCH_FIELDS },
    { title: '🏛️ GOVERNANCE BENCHMARKS', fields: GOV_BENCH_FIELDS },
];

const downloadTemplate = (type = 'csv') => {
    const wb = XLSX.utils.book_new();
    const wsData = [['Field Key (do NOT edit)', 'KPI Label', 'Hint / Description', 'Target Value  ← fill here']];

    SECTION_GROUPS.forEach(({ title, fields }) => {
        wsData.push([title, '', '', '']);
        Object.entries(fields).forEach(([key, { label, hint, example }]) => {
            wsData.push([key, label, hint, example]);
        });
        wsData.push(['', '', '', '']);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [{ wch: 30 }, { wch: 35 }, { wch: 45 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Benchmarks');

    if (type === 'xlsx') {
        XLSX.writeFile(wb, 'ESG_Benchmarks_Template.xlsx');
    } else {
        XLSX.writeFile(wb, 'ESG_Benchmarks_Template.csv', { bookType: 'csv' });
    }
};

const BenchmarkUploadPage = () => {
    const navigate = useNavigate();
    const [dragOver, setDragOver] = useState(false);
    const [fileName, setFileName] = useState('');
    const [parsedRow, setParsedRow] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);
    const [parseError, setParseError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const fileInputRef = useRef(null);

    const processFile = (file) => {
        setParseError(''); setValidationErrors([]); setParsedRow(null);
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
                const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

                if (!aoa || aoa.length === 0) {
                    setParseError('File is empty.');
                    return;
                }

                const headerRow = aoa[0].map(c => String(c).toLowerCase());
                const keyCol = headerRow.findIndex(h => h.includes('field key'));
                const valCol = headerRow.findIndex(h => h.includes('target value') || h.includes('fill here'));

                if (keyCol === -1 || valCol === -1) {
                    setParseError('Column headers "Field Key" or "Target Value" not found. Please use the template.');
                    return;
                }

                const map = {};
                for (let i = 1; i < aoa.length; i++) {
                    const rowKey = String(aoa[i][keyCol] ?? '').trim();
                    if (rowKey && ALL_BENCH_FIELDS[rowKey]) {
                        map[rowKey] = aoa[i][valCol];
                    }
                }

                const missing = validateRow(map);
                if (missing.length > 0) {
                    setValidationErrors(missing);
                } else {
                    setParsedRow(map);
                    setPreviewOpen(true);
                }
            } catch (err) {
                setParseError('Failed to parse file.');
                console.error(err);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleUpload = async () => {
        setLoading(true);
        try {
            const promises = [];
            
            Object.entries(parsedRow).forEach(([key, val]) => {
                const parsedVal = parseValue(key, val);
                const payload = {
                    kpiName: key,
                    benchmarkValue: typeof parsedVal === 'boolean' ? (parsedVal ? 1 : 0) : parsedVal
                };

                if (ENV_BENCH_FIELDS[key]) {
                    promises.push(api.post('/core/environment/benchmark', payload));
                } else if (SOC_BENCH_FIELDS[key]) {
                    promises.push(api.post('/core/social/benchmark', payload));
                } else if (GOV_BENCH_FIELDS[key]) {
                    promises.push(api.post('/core/governance/benchmark', payload));
                }
            });

            await Promise.all(promises);

            setSuccessMsg('Benchmarks updated successfully!');
            setTimeout(() => navigate('/benchmarks'), 2000);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Failed to update benchmarks.');
        } finally {
            setLoading(false);
            setPreviewOpen(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.gridBackground}></div>
            <div className={`${styles.decorativeSphere} ${styles.sphere1}`}></div>
            <div className={`${styles.decorativeSphere} ${styles.sphere2}`}></div>

            <div className={styles.container}>
                <div className={styles.header}>
                    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={styles.uploadBadge}>
                        <Target size={14} /> Bulk Benchmark Setup
                    </motion.div>
                    <h1 className={styles.title}>Upload Benchmarks</h1>
                    <p className={styles.subtitle}>Set your ESG targets globally using a spreadsheet.</p>
                </div>

                {successMsg && <div className={styles.alertSuccess}><CheckCircle2 size={18} /> {successMsg}</div>}
                {errorMsg && <div className={styles.alertError}><AlertCircle size={18} /> {errorMsg}</div>}

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div className={styles.stepBadge}>1</div>
                        <div>
                            <h3 className={styles.cardTitle}>Download Template</h3>
                            <p className={styles.cardSub}>Get the structured file for benchmark KPIs.</p>
                        </div>
                    </div>
                    <div className={styles.templateBtns}>
                        <button onClick={() => downloadTemplate('xlsx')} className={styles.templateBtnXlsx}>
                            <FileSpreadsheet size={18} /> Download Excel (.xlsx)
                        </button>
                        <button onClick={() => downloadTemplate('csv')} className={styles.templateBtnCsv}>
                            <Download size={18} /> Download CSV
                        </button>
                    </div>

                    <details className={styles.fieldRef}>
                        <summary className={styles.fieldRefSummary}><Info size={14} /> View KPI Guide</summary>
                        <div className={styles.fieldRefBody}>
                            {SECTION_GROUPS.map(({ title, fields }) => (
                                <div key={title} className={styles.fieldGroup}>
                                    <h4 className={`${styles.fieldGroupTitle} ${title.includes('ENV') ? styles.env : title.includes('SOC') ? styles.soc : styles.gov}`}>
                                        {title}
                                    </h4>
                                    {Object.entries(fields).map(([key, { label, type }]) => (
                                        <div key={key} className={styles.fieldRow}>
                                            <span className={styles.fieldKey}>{key}</span>
                                            <span className={styles.fieldLabel}>{label}</span>
                                            <span className={styles.fieldType}>{type || 'number'}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </details>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div className={styles.stepBadge}>2</div>
                        <div>
                            <h3 className={styles.cardTitle}>Upload & Preview</h3>
                            <p className={styles.cardSub}>Drag your filled template here.</p>
                        </div>
                    </div>

                    <div 
                        className={`${styles.dropzone} ${dragOver ? styles.dropzoneActive : ''} ${fileName ? styles.dropzoneFilled : ''}`}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files[0]); }}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <input type="file" ref={fileInputRef} hidden onChange={(e) => processFile(e.target.files[0])} accept=".csv,.xlsx,.xls" />
                        <div className={styles.dropzoneContent}>
                            {fileName ? (
                                <div className={styles.fileSelected}>
                                    <FileSpreadsheet size={48} className={styles.fileIcon} />
                                    <span className={styles.fileName}>{fileName}</span>
                                    <span className={styles.fileReplaceHint}>Click to replace file</span>
                                </div>
                            ) : (
                                <>
                                    <Upload size={48} className={styles.uploadIcon} />
                                    <p className={styles.dropzoneText}>Drag and drop file</p>
                                    <p className={styles.dropzoneOr}>or <span>browse files</span></p>
                                    <p className={styles.dropzoneFormats}>CSV, XLSX or XLS</p>
                                </>
                            )}
                        </div>
                    </div>

                    {parseError && <div className={`${styles.alertError} mt-4`}><X size={16} /> {parseError}</div>}
                    
                    {validationErrors.length > 0 && (
                        <div className={styles.validationBox}>
                            <h4 className={styles.validationTitle}><AlertCircle size={16} /> Missing Fields</h4>
                            <ul className={styles.validationList}>
                                {validationErrors.map((err, i) => <li key={i}>{err}</li>)}
                            </ul>
                        </div>
                    )}

                    {parsedRow && !parseError && validationErrors.length === 0 && (
                        <div className={styles.parsedActions}>
                            <button onClick={() => setPreviewOpen(true)} className={styles.previewBtn}><Eye size={18} /> Preview Data</button>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {previewOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.previewOverlay}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className={styles.previewCard}>
                            <button className={styles.closePreviewBtn} onClick={() => setPreviewOpen(false)}><X size={20} /></button>
                            <div className={styles.previewHeader}>
                                <h2 className={styles.scoreTitle}>Review Benchmarks</h2>
                                <p className={styles.scoreSubtitle}>Double-check your targets before updating.</p>
                            </div>

                            <div className={styles.previewBody}>
                                {SECTION_GROUPS.map(({ title, fields }) => (
                                    <div key={title} className={styles.previewSection}>
                                        <div className={`${styles.previewSectionHeader} ${title.includes('ENV') ? styles.env : title.includes('SOC') ? styles.soc : styles.gov}`}>
                                            {title}
                                        </div>
                                        <div className={styles.previewGrid}>
                                            {Object.entries(fields).map(([key, { label }]) => (
                                                <div key={key} className={styles.previewItem}>
                                                    <span className={styles.previewLabel}>{label}</span>
                                                    <span className={styles.previewValue}>{parsedRow?.[key]?.toString() ?? '—'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.submitRow}>
                                <button className={styles.cancelBtn} onClick={() => setPreviewOpen(false)}>Back to Upload</button>
                                <button className={styles.submitBtn} onClick={handleUpload} disabled={loading}>
                                    {loading ? <Loader2 size={18} className={styles.spin} /> : <CheckCircle2 size={18} />}
                                    {loading ? 'Updating...' : 'Confirm Update'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BenchmarkUploadPage;
