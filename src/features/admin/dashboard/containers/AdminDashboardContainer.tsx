import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminDashboardPresenter from '../presenters/AdminDashboardPresenter';

const AdminDashboardContainer: React.FC = () => {
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
