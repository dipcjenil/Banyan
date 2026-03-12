import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, logoutUser } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const data = await getMe();
            if (data.success) setUser(data.user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = (userData) => setUser(userData);

    const logout = async () => {
        try {
            await logoutUser();
        } catch {}
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, refreshUser: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export default AuthContext;
