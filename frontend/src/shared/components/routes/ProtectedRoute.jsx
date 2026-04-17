import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../../features/auth/context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading, checkStatus } = useAuth();
    const location = useLocation();
    const [statusChecked, setStatusChecked] = useState(false);
    const [isActive, setIsActive] = useState(true);

    // Check active status from backend on every route change for ROLE_USER
    useEffect(() => {
        let cancelled = false;

        const verify = async () => {
            if (user && user.role === 'ROLE_USER' && checkStatus) {
                const active = await checkStatus();
                if (!cancelled) {
                    setIsActive(active);
                    setStatusChecked(true);
                }
            } else {
                setStatusChecked(true);
                setIsActive(true);
            }
        };

        verify();
        return () => { cancelled = true; };
    }, [location.pathname, user?.id]);

    if (loading || (!statusChecked && user?.role === 'ROLE_USER')) {
        return <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check for role-based access
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === 'ROLE_ADMIN') {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    // Redirect disabled companies to /blocked page
    if (user.role === 'ROLE_USER' && isActive === false) {
        return <Navigate to="/blocked" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
