import axios from 'axios';

const API_URL = 'http://localhost:8080/core/api/admin/benchmarks';

const getAllBenchmarkStandards = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.jwt;

    const response = await axios.get(API_URL, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'X-User-Role': user?.role // Forwarded for convenience, though gateway should handle it
        }
    });
    return response.data;
};

const updateBenchmarkStandard = async (kpiName, newValue) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.jwt;

    // The backend endpoint is PUT /{kpiName}?newValue=...
    const response = await axios.put(`${API_URL}/${kpiName}?newValue=${newValue}`, {}, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'X-User-Role': user?.role
        }
    });
    return response.data;
};

const adminService = {
    getAllBenchmarkStandards,
    updateBenchmarkStandard
};

export default adminService;
