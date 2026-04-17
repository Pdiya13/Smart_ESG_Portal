import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

/**
 * Normalizes the user object to always have flat fields:
 * { jwt, companyName, email, cin, id }
 * This handles BOTH:
 *  - Old format: { jwt, company: { companyName, email, cin, id } }
 *  - New format: { jwt, companyName, email, cin, id }
 */
const normalizeUser = (userData) => {
    if (!userData) return null;
    
    // Handle new generic 'user' field
    if (userData.user) {
        const { user, ...rest } = userData;
        return { ...rest, ...user };
    }

    // Already flattened (new format)
    if (userData.role || userData.companyName || userData.email) {
        return userData;
    }

    // Old nested format - flatten it
    if (userData.company) {
        const { company, ...rest } = userData;
        return { ...rest, ...company };
    }
    return userData;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
            const normalized = normalizeUser(storedUser);
            setUser(normalized);
            // Also fix localStorage so it stays consistent going forward
            if (normalized !== storedUser) {
                localStorage.setItem('user', JSON.stringify(normalized));
            }
        }
        setLoading(false);
    }, []);

    const login = async (data) => {
        const userData = await authService.login(data);
        const normalized = normalizeUser(userData);
        setUser(normalized);
        return normalized;
    };

    const signup = async (data) => {
        const userData = await authService.signup(data);
        const normalized = normalizeUser(userData);
        setUser(normalized);
        return normalized;
    };

    const updateUser = async (data) => {
        const updatedUser = await authService.updateCompany(data);
        const normalized = normalizeUser(updatedUser);
        setUser(normalized);
        return normalized;
    };

    const checkStatus = async () => {
        const active = await authService.checkAccountStatus();
        if (active !== null && user) {
            const updatedUser = { ...user, active };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return active;
        }
        return user?.active ?? true;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateUser, checkStatus, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
