import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import { Button } from '../../../shared/components/ui/Button';
import { Settings, Save, RefreshCcw, AlertTriangle, CheckCircle2, Search, Filter } from 'lucide-react';
import styles from './AdminBenchmarkPage.module.css';

const AdminBenchmarkPage = () => {
    const [benchmarks, setBenchmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [editingKpi, setEditingKpi] = useState(null);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        fetchBenchmarks();
    }, []);

    const fetchBenchmarks = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllBenchmarkStandards();
            setBenchmarks(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch benchmark standards. Please ensure core service is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (kpiName) => {
        try {
            setSuccess(null);
            const val = parseFloat(editValue);
            if (isNaN(val)) {
                setError('Please enter a valid numeric value');
                return;
            }

            await adminService.updateBenchmarkStandard(kpiName, val);
            setSuccess(`Successfully updated ${kpiName} standard!`);
            setEditingKpi(null);
            fetchBenchmarks();

            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to update benchmark standard.');
            console.error(err);
        }
    };

    const filteredBenchmarks = benchmarks.filter(b => {
        const matchesSearch = b.kpiName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             b.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'ALL' || b.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const getCategoryClass = (category) => {
        switch (category) {
            case 'ENVIRONMENT': return styles.envTag;
            case 'SOCIAL': return styles.socialTag;
            case 'GOVERNANCE': return styles.govTag;
            default: return '';
        }
    };

    if (loading && benchmarks.length === 0) {
        return (
            <div className={styles.loaderContainer}>
                <RefreshCcw className={styles.spinIcon} size={48} />
                <p>Loading global standards...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <Settings className={styles.headerIcon} />
                    <div>
                        <h1>Global Benchmark Management</h1>
                        <p>Configure ESG standards for all registered companies</p>
                    </div>
                </div>
                <Button variant="outline" onClick={fetchBenchmarks} className={styles.refreshBtn}>
                    <RefreshCcw size={16} /> Refresh
                </Button>
            </header>

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

            <div className={styles.controls}>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Search KPIs..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.filterBox}>
                    <Filter size={18} />
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                        <option value="ALL">All Categories</option>
                        <option value="ENVIRONMENT">Environment</option>
                        <option value="SOCIAL">Social</option>
                        <option value="GOVERNANCE">Governance</option>
                    </select>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>KPI Name</th>
                            <th>Description</th>
                            <th>Current Standard</th>
                            <th>Logic</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBenchmarks.map((b) => (
                            <tr key={b.id} className={editingKpi === b.kpiName ? styles.editingRow : ''}>
                                <td>
                                    <span className={`${styles.tag} ${getCategoryClass(b.category)}`}>
                                        {b.category}
                                    </span>
                                </td>
                                <td className={styles.kpiName}>{b.kpiName}</td>
                                <td className={styles.description}>{b.description || 'Global Standard'}</td>
                                <td>
                                    {editingKpi === b.kpiName ? (
                                        <input 
                                            type="number" 
                                            className={styles.editInput}
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            step="0.1"
                                            autoFocus
                                        />
                                    ) : (
                                        <span className={styles.value}>{b.benchmarkValue}</span>
                                    )}
                                </td>
                                <td>
                                    <code className={styles.code}>{b.comparisonType}</code>
                                </td>
                                <td>
                                    {editingKpi === b.kpiName ? (
                                        <div className={styles.actionGroup}>
                                            <Button size="sm" onClick={() => handleUpdate(b.kpiName)}>
                                                <Save size={14} /> Save
                                            </Button>
                                            <Button size="sm" variant="ghost" onClick={() => setEditingKpi(null)}>
                                                Cancel
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button size="sm" variant="outline" onClick={() => {
                                            setEditingKpi(b.kpiName);
                                            setEditValue(b.benchmarkValue.toString());
                                        }}>
                                            Edit
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredBenchmarks.length === 0 && (
                    <div className={styles.noData}>
                        <p>No benchmarks found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBenchmarkPage;
