import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminDashboardPresenter from '../presenters/AdminDashboardPresenter';
import { useAuth } from 'hooks/auth/useAuth';

const AdminDashboardContainer: React.FC = () => {
  const { isAuthenticated, isChecking } = useAuth();

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">認証確認中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // useAuthがリダイレクトを処理
  }

  return (
    <>
      <Helmet>
        <title>管理画面ダッシュボード | ホロリスの推し活サポート</title>
        <meta name="description" content="ホロリスの推し活サポートの管理画面ダッシュボード" />
      </Helmet>
      <AdminDashboardPresenter />
    </>
  );
};

export default AdminDashboardContainer;
