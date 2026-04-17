import { Routes, Route } from 'react-router-dom';
import MainLayout from '../shared/layouts/MainLayout';
import HomePage from '../features/home/pages/HomePage';
import FeaturesPage from '../features/home/pages/FeaturesPage';
import AuthPage from '../features/auth/pages/AuthPage';
import BlockedPage from '../features/auth/pages/BlockedPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import ESGSubmitPage from '../features/dashboard/pages/ESGSubmitPage';
import ESGBenchmarkPage from '../features/dashboard/pages/ESGBenchmarkPage';
import ESGUploadPage from '../features/dashboard/pages/ESGUploadPage';
import AnalyticsPage from '../features/dashboard/pages/AnalyticsPage';
import AdminBenchmarkPage from '../features/dashboard/pages/AdminBenchmarkPage';
import AdminDashboardPage from '../features/dashboard/pages/AdminDashboardPage';
import ProfilePage from '../features/auth/pages/ProfilePage';
import BenchmarkUploadPage from '../features/dashboard/pages/BenchmarkUploadPage';
import ProtectedRoute from '../shared/components/routes/ProtectedRoute';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="features" element={<FeaturesPage />} />

                {/* Company/User Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['ROLE_USER']} />}>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="submit-esg" element={<ESGSubmitPage />} />
                    <Route path="benchmarks" element={<ESGBenchmarkPage />} />
                    <Route path="upload-esg" element={<ESGUploadPage />} />
                    <Route path="upload-benchmarks" element={<BenchmarkUploadPage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>

                {/* Admin Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                    <Route path="admin/dashboard" element={<AdminDashboardPage />} />
                    <Route path="admin/benchmarks" element={<AdminBenchmarkPage />} />
                    {/* Reuse profile page for admin as well */}
                    <Route path="admin/profile" element={<ProfilePage />} />
                </Route>
            </Route>

            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/blocked" element={<BlockedPage />} />
        </Routes>
    );
};

export default AppRoutes;
