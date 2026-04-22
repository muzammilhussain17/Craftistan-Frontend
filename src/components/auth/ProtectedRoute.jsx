import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { LoginModal } from './LoginModal';

export function ProtectedRoute({ children, allowedRoles }) {
    const { user, isLoading } = useAuth();
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            setShowLogin(true);
        }
    }, [isLoading, user]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-stone-400">Loading...</div>; // Replace with proper Skeleton later
    }

    // Not logged in -> Show Login Modal (and maybe render nothing or a specific 'unauthorized' view underneath)
    if (!user) {
        return (
            <>
                <div className="min-h-screen flex items-center justify-center bg-stone-50">
                    <p className="text-stone-500">Please sign in to access this page.</p>
                </div>
                <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
            </>
        );
    }

    // Logged in but wrong role -> Redirect to Home
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}
