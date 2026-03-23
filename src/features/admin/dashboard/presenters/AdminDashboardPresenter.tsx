import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPresenter: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'イベント管理',
      description: 'イベントの作成・編集・削除を行います',
      path: '/admin/events',
      icon: '📅',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'タレント管理',
      description: 'タレント情報の管理を行います',
      path: '/admin/talents',
      icon: '👤',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      title: '楽曲一覧管理',
      description: '楽曲の一覧・登録・編集・削除を行います',
      path: '/admin/talent-music',
      icon: '🎵',
      color: 'bg-pink-500 hover:bg-pink-600',
    },
    {
      title: '月次スケジュール',
      description: '月次のスケジュールを確認・管理します',
      path: '/life/life-schedule-month',
      icon: '📆',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">管理画面ダッシュボード</h1>
          <p className="text-gray-600">各種管理機能にアクセスできます</p>
        </div>

        {/* メニューカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 text-left border border-gray-200 hover:border-gray-300"
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-2xl text-white transition-colors duration-200`}>
                  {item.icon}
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h2>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </button>
          ))}
        </div>

        {/* 統計情報エリア（将来的な拡張用） */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">システム情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">ログイン状態</p>
              <p className="text-2xl font-bold text-blue-600">認証済み</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">アクセスレベル</p>
              <p className="text-2xl font-bold text-green-600">管理者</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">最終ログイン</p>
              <p className="text-2xl font-bold text-purple-600">今日</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPresenter;
