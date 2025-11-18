import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
export default function ProtectedRoute(_a) {
    var children = _a.children;
    var isAuthenticated = useAuth().isAuthenticated;
    var _b = useLocation(), setLocation = _b[1];
    useEffect(function () {
        if (!isAuthenticated) {
            setLocation('/login');
        }
    }, [isAuthenticated, setLocation]);
    if (!isAuthenticated) {
        return null;
    }
    return <>{children}</>;
}
