import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles, redirectPath = '/' }) => {
    const storedRole = localStorage.getItem("userRole");

    if (!allowedRoles.includes(storedRole)) {
        return <Navigate to={redirectPath} replace />;
    }

    return children;
}

export default ProtectedRoute;

