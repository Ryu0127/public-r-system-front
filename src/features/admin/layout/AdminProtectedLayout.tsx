import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from 'hooks/auth/useAuth';

/**
 * 管理画面（/admin/*）の一律認証レイアウト。
 * 未認証は useAuth により /login へリダイレクト（遷移元を state に保持）。
 */
const AdminProtectedLayout: React.FC = () => {
  const { isAuthenticated, isChecking } = useAuth();

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          <p className="mt-4 text-gray-600">認証確認中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Outlet />;
};

export default AdminProtectedLayout;
