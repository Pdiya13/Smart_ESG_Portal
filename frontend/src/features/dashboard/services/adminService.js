import axios from 'axios';

const BENCHMARK_API_URL = 'http://localhost:8080/core/api/admin/benchmarks';
const COMPANY_API_URL = 'http://localhost:8080/auth/admin/companies';

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.jwt;
    return {
        'Authorization': `Bearer ${token}`,
        'X-User-Role': user?.role
    };
};

const getAllBenchmarkStandards = async () => {
    const response = await axios.get(BENCHMARK_API_URL, {
        headers: getAuthHeaders()
    });
    return response.data;
};

const updateBenchmarkStandard = async (kpiName, newValue) => {
    const response = await axios.put(`${BENCHMARK_API_URL}/${kpiName}?newValue=${newValue}`, {}, {
        headers: getAuthHeaders()
    });
    return response.data;
};

const getAllCompanies = async () => {
    const response = await axios.get(COMPANY_API_URL, {
        headers: getAuthHeaders()
    });
    return response.data;
};

const toggleCompanyStatus = async (companyId) => {
    const response = await axios.put(`${COMPANY_API_URL}/${companyId}/toggle`, {}, {
        headers: getAuthHeaders()
    });
    return response.data;
};

const adminService = {
    getAllBenchmarkStandards,
    updateBenchmarkStandard,
    getAllCompanies,
    toggleCompanyStatus
};

export default adminService;

