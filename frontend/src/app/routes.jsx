import { Routes, Route } from 'react-router-dom';
import MainLayout from '../shared/layouts/MainLayout';
import HomePage from '../features/home/pages/HomePage';
import AuthPage from '../features/auth/pages/AuthPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                {/* Add more routes here as we build them */}
            </Route>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
        </Routes>
    );
};

export default AppRoutes;
