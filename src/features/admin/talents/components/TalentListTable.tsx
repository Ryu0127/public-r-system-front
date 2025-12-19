import React from 'react';
import { AdminTalent, TALENT_STATUS_LABELS } from '../../talent-edit/types';

interface TalentListTableProps {
  talents: AdminTalent[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TalentListTable: React.FC<TalentListTableProps> = ({
  talents,
  onEdit,
  onDelete,
}) => {
  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'graduated':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusLabel = (status?: string) => {
    return TALENT_STATUS_LABELS[status || 'active'] || '活動中';
  };

  const handleDeleteClick = (talent: AdminTalent) => {
    if (window.confirm(`「${talent.talentName}」を削除してもよろしいですか？`)) {
      onDelete(talent.id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border-b text-left text-sm font-medium">ID</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium">タレント名</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium">英語名</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium">グループ</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium">ステータス</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium">操作</th>
          </tr>
        </thead>
        <tbody>
          {talents.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                タレントがありません
              </td>
            </tr>
          ) : (
            talents.map((talent) => (
              <tr key={talent.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b text-sm">{talent.id}</td>
                <td className="px-4 py-2 border-b text-sm font-medium">{talent.talentName}</td>
                <td className="px-4 py-2 border-b text-sm">{talent.talentNameEn}</td>
                <td className="px-4 py-2 border-b text-sm">{talent.groupName}</td>
                <td className="px-4 py-2 border-b">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(
                      talent.status
                    )}`}
                  >
                    {getStatusLabel(talent.status)}
                  </span>
                </td>
                <td className="px-4 py-2 border-b text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(talent.id)}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDeleteClick(talent)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                    >
                      削除
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TalentListTable;
