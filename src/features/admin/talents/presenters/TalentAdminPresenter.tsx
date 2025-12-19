import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminTalent } from '../../talent-edit/types';
import TalentListTable from '../components/TalentListTable';

interface TalentAdminPresenterProps {
  talents: AdminTalent[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => Promise<boolean>;
}

const TalentAdminPresenter: React.FC<TalentAdminPresenterProps> = ({
  talents,
  loading,
  error,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('all');

  const handleEdit = (id: string) => {
    navigate(`/admin/talents/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    await onDelete(id);
  };

  // フィルタリングと検索
  const filteredTalents = talents.filter((talent) => {
    const matchesStatus = filterStatus === 'all' || talent.status === filterStatus;
    const matchesGroup = filterGroup === 'all' || talent.groupName === filterGroup;
    const matchesSearch =
      searchQuery === '' ||
      talent.talentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.talentNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.twitterAccounts.some((account) =>
        account.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesStatus && matchesGroup && matchesSearch;
  });

  // グループの一覧を取得（重複を除く）
  const uniqueGroups = Array.from(new Set(talents.map((t) => t.groupName))).sort();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">タレント管理</h1>
            <button
              onClick={() => navigate('/admin/talents/new')}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              + 新規作成
            </button>
          </div>

          {/* 検索とフィルター */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="タレント名またはTwitterアカウントで検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border rounded"
            />
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="px-4 py-2 border rounded"
            >
              <option value="all">すべてのグループ</option>
              {uniqueGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded"
            >
              <option value="all">すべてのステータス</option>
              <option value="active">活動中</option>
              <option value="inactive">休止中</option>
              <option value="graduated">卒業</option>
            </select>
          </div>

          {/* 統計情報 */}
          <div className="mt-4 flex gap-4 text-sm">
            <div className="text-gray-600">
              全タレント: <span className="font-bold">{talents.length}</span>
            </div>
            <div className="text-gray-600">
              活動中:{' '}
              <span className="font-bold">
                {talents.filter((t) => t.status === 'active' || !t.status).length}
              </span>
            </div>
            <div className="text-gray-600">
              休止中:{' '}
              <span className="font-bold">
                {talents.filter((t) => t.status === 'inactive').length}
              </span>
            </div>
            <div className="text-gray-600">
              卒業:{' '}
              <span className="font-bold">
                {talents.filter((t) => t.status === 'graduated').length}
              </span>
            </div>
          </div>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* ローディング */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">読み込み中...</p>
          </div>
        )}

        {/* タレント一覧テーブル */}
        {!loading && (
          <div className="bg-white rounded-lg shadow">
            <TalentListTable
              talents={filteredTalents}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TalentAdminPresenter;
