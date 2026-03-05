import { Routes, Route } from 'react-router-dom';
import MainLayout from '../shared/layouts/MainLayout';
import HomePage from '../features/home/pages/HomePage';
import FeaturesPage from '../features/home/pages/FeaturesPage';
import AuthPage from '../features/auth/pages/AuthPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import ESGSubmitPage from '../features/dashboard/pages/ESGSubmitPage';
import ESGBenchmarkPage from '../features/dashboard/pages/ESGBenchmarkPage';
import ESGUploadPage from '../features/dashboard/pages/ESGUploadPage';
import ProtectedRoute from '../shared/components/routes/ProtectedRoute';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="features" element={<FeaturesPage />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="submit-esg" element={<ESGSubmitPage />} />
                    <Route path="benchmarks" element={<ESGBenchmarkPage />} />
                    <Route path="upload-esg" element={<ESGUploadPage />} />
                </Route>
            </Route>

            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
        </Routes>
    );
};

export default AppRoutes;
