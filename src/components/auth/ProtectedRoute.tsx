import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/models';
import { ShieldAlert, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, currentUser, canAccess } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1c050c] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 p-8 rounded-3xl glass-panel border border-[rgba(226,184,178,0.25)] shadow-luxury max-w-sm w-full text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#731d34] to-[#2c0c15] flex items-center justify-center border border-[rgba(226,184,178,0.4)] shadow-subtle animate-pulse">
            <Loader2 className="w-6 h-6 text-[#e7cfaf] animate-spin" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-normal text-[#f7efe7]">Thekkanath Souparnika</h3>
            <p className="text-xs text-[rgba(203,184,185,0.7)] mt-1">Verifying secure staff session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !canAccess(allowedRoles)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-rose-200 p-8 text-center shadow-lg space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Access Restricted</h2>
          <p className="text-sm text-gray-600">
            Your role (<strong>{currentUser.role}</strong>) does not have permission to view this section of the venue studio.
          </p>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : null;
};
