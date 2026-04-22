import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for stored session on mount
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('craftistan_token');
            const storedUser = localStorage.getItem('craftistan_user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));

                // Validate token by fetching current user
                try {
                    const result = await authApi.getCurrentUser();
                    if (result.success && result.data) {
                        // Support both flat { id, name... } and wrapped { user: {...} } shapes
                        const userData = result.data.user || result.data.data || result.data;
                        if (userData && userData.id) {
                            setUser({
                                id: userData.id,
                                name: userData.name,
                                email: userData.email,
                                role: userData.role,
                                avatar: userData.avatar,
                            });
                        }
                    }
                } catch (error) {
                    // Token might be expired, keep using stored user data
                    console.log('Could not validate token, using stored data');
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);

        try {
            const result = await authApi.login(email, password);

            if (result.success && result.data) {
                const responseData = result.data;

                // Check if login was successful
                if (responseData.success === false) {
                    setIsLoading(false);
                    return { success: false, error: responseData.message || 'Login failed' };
                }

                // Extract user info and token
                const userData = responseData.user;
                const accessToken = responseData.accessToken;

                if (!userData || !accessToken) {
                    setIsLoading(false);
                    return { success: false, error: 'Invalid response from server' };
                }

                const userInfo = {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    role: userData.role,
                    avatar: userData.avatar,
                };

                setUser(userInfo);
                setToken(accessToken);

                localStorage.setItem('craftistan_user', JSON.stringify(userInfo));
                localStorage.setItem('craftistan_token', accessToken);

                setIsLoading(false);
                return { success: true };
            } else {
                setIsLoading(false);
                return { success: false, error: result.error || 'Login failed' };
            }
        } catch (error) {
            setIsLoading(false);
            return { success: false, error: error.message || 'Network error. Please try again.' };
        }
    };

    const signup = async (data) => {
        setIsLoading(true);

        try {
            const result = await authApi.register(data.name, data.email, data.password, data.role || 'BUYER');

            if (result.success && result.data) {
                const responseData = result.data;

                if (responseData.success) {
                    setIsLoading(false);
                    return { success: true, message: responseData.message || 'Account created successfully! Please login.' };
                } else {
                    setIsLoading(false);
                    return { success: false, error: responseData.message || 'Registration failed' };
                }
            } else {
                setIsLoading(false);
                return { success: false, error: result.error || 'Registration failed' };
            }
        } catch (error) {
            setIsLoading(false);
            return { success: false, error: error.message || 'Network error. Please try again.' };
        }
    };

    const googleLogin = async () => {
        // Google OAuth - to be implemented with OAuth2
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        return { success: false, error: 'Google login not yet implemented. Please use email/password.' };
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('craftistan_user');
        localStorage.removeItem('craftistan_token');
    };

    const updateUser = (updatedUserData) => {
        const newUserData = { ...user, ...updatedUserData };
        setUser(newUserData);
        localStorage.setItem('craftistan_user', JSON.stringify(newUserData));
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isLoading,
            isAuthenticated: !!user && !!token,
            login,
            signup,
            googleLogin,
            logout,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
