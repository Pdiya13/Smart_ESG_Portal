import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, RefreshCcw, Search, Filter, AlertTriangle, CheckCircle2, Building2, UserX, UserCheck } from 'lucide-react';
import adminService from '../services/adminService';
import styles from './AdminDashboardPage.module.css';

const AdminDashboardPage = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [togglingId, setTogglingId] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState(null);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await adminService.getAllCompanies();
            setCompanies(data);
        } catch (err) {
            setError('Failed to fetch companies. Please ensure auth service is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleClick = (company) => {
        setConfirmDialog({
            company,
            newStatus: !company.active
        });
    };

    const handleConfirmToggle = async () => {
        if (!confirmDialog) return;

        const { company } = confirmDialog;
        try {
            setTogglingId(company.id);
            setError(null);
            const updated = await adminService.toggleCompanyStatus(company.id);

            setCompanies(prev => prev.map(c => c.id === updated.id ? updated : c));
            setSuccess(`Successfully ${updated.active ? 'enabled' : 'disabled'} ${updated.companyName}`);
            setTimeout(() => setSuccess(null), 4000);
        } catch (err) {
            setError(`Failed to update ${company.companyName}. Please try again.`);
            console.error(err);
        } finally {
            setTogglingId(null);
            setConfirmDialog(null);
        }
    };

    const filteredCompanies = companies.filter(c => {
        const matchesSearch =
            c.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.cin?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === 'ALL' ||
            (statusFilter === 'ACTIVE' && c.active) ||
            (statusFilter === 'DISABLED' && !c.active);
        return matchesSearch && matchesStatus;
    });

    const activeCount = companies.filter(c => c.active).length;
    const disabledCount = companies.filter(c => !c.active).length;

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading && companies.length === 0) {
        return (
            <div className={styles.loadingContainer}>
                <RefreshCcw className={styles.spinIcon} size={48} />
                <p>Loading companies...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <div>
                        <h1>Company Management</h1>
                        <p>Monitor and manage portal access for all registered companies</p>
                    </div>
                </div>
                <button onClick={fetchCompanies} className={styles.refreshBtn}>
                    <RefreshCcw size={16} /> Refresh
                </button>
            </header>

            {/* Stats Row */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Total Companies</div>
                    <div className={`${styles.statValue} ${styles.total}`}>{companies.length}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Active</div>
                    <div className={`${styles.statValue} ${styles.active}`}>{activeCount}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Disabled</div>
                    <div className={`${styles.statValue} ${styles.disabled}`}>{disabledCount}</div>
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <div className={styles.alertError}>
                    <AlertTriangle size={20} />
                    <span>{error}</span>
                </div>
            )}
            {success && (
                <div className={styles.alertSuccess}>
                    <CheckCircle2 size={20} />
                    <span>{success}</span>
                </div>
            )}

            {/* Controls */}
            <div className={styles.controls}>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by company name, email, or CIN..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.filterBox}>
                    <Filter size={18} />
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active Only</option>
                        <option value="DISABLED">Disabled Only</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>CIN</th>
                            <th>Email</th>
                            <th>Registered</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCompanies.map((company) => (
                            <tr key={company.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Building2 size={18} style={{ color: '#6b7280', flexShrink: 0 }} />
                                        <span className={styles.companyName}>{company.companyName}</span>
                                    </div>
                                </td>
                                <td><span className={styles.cin}>{company.cin}</span></td>
                                <td><span className={styles.email}>{company.email}</span></td>
                                <td><span className={styles.date}>{formatDate(company.createdAt)}</span></td>
                                <td>
                                    <span className={`${styles.statusBadge} ${company.active ? styles.statusActive : styles.statusDisabled}`}>
                                        <span className={styles.statusDot}></span>
                                        {company.active ? 'Active' : 'Disabled'}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.toggleContainer}>
                                        <button
                                            className={`${styles.toggleSwitch} ${company.active ? styles.active : ''} ${togglingId === company.id ? styles.loading : ''}`}
                                            onClick={() => handleToggleClick(company)}
                                            disabled={togglingId === company.id}
                                            title={company.active ? 'Click to disable' : 'Click to enable'}
                                        >
                                            <span className={styles.toggleKnob}></span>
                                        </button>
                                        <span className={styles.toggleLabel}>
                                            {company.active ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredCompanies.length === 0 && (
                    <div className={styles.noData}>
                        <p>No companies found matching your search.</p>
                    </div>
                )}
            </div>

            {/* Confirmation Dialog */}
            <AnimatePresence>
                {confirmDialog && (
                    <motion.div
                        className={styles.confirmOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setConfirmDialog(null)}
                    >
                        <motion.div
                            className={styles.confirmDialog}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={`${styles.confirmIcon} ${confirmDialog.newStatus ? styles.confirmIconEnable : styles.confirmIconDisable}`}>
                                {confirmDialog.newStatus ? <UserCheck size={28} /> : <UserX size={28} />}
                            </div>
                            <h3>
                                {confirmDialog.newStatus ? 'Enable' : 'Disable'} Company?
                            </h3>
                            <p>
                                Are you sure you want to {confirmDialog.newStatus ? 'enable' : 'disable'}{' '}
                                <span className={styles.companyHighlight}>{confirmDialog.company.companyName}</span>?
                                {!confirmDialog.newStatus && (
                                    <> This company will not be able to access ESG portal features.</>
                                )}
                                {confirmDialog.newStatus && (
                                    <> This company will regain full access to all ESG portal features.</>
                                )}
                            </p>
                            <div className={styles.confirmActions}>
                                <button
                                    className={styles.btnCancel}
                                    onClick={() => setConfirmDialog(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={`${styles.btnConfirm} ${confirmDialog.newStatus ? styles.btnConfirmEnable : styles.btnConfirmDisable}`}
                                    onClick={handleConfirmToggle}
                                >
                                    {confirmDialog.newStatus ? 'Enable' : 'Disable'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboardPage;
