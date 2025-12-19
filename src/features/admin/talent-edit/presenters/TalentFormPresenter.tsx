import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminTalent } from '../types';
import TalentForm from '../components/TalentForm';

interface TalentFormPresenterProps {
  talent?: AdminTalent;
  loading: boolean;
  error: string | null;
  onSave: (talentData: Partial<AdminTalent>) => Promise<boolean>;
  onDelete?: () => Promise<boolean>;
}

const TalentFormPresenter: React.FC<TalentFormPresenterProps> = ({
  talent,
  loading,
  error,
  onSave,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleSave = async (talentData: Partial<AdminTalent>) => {
    const success = await onSave(talentData);
    if (success) {
      alert(talent ? 'タレント情報を更新しました' : 'タレントを作成しました');
      navigate('/admin/talents');
    }
  };

  const handleCancel = () => {
    navigate('/admin/talents');
  };

  const handleDelete = async () => {
    if (onDelete) {
      const success = await onDelete();
      if (success) {
        alert('タレントを削除しました');
        navigate('/admin/talents');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {talent ? 'タレント編集' : 'タレント新規作成'}
          </h1>
        </div>

        {error && (
          <div className="mb-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">読み込み中...</p>
          </div>
        ) : (
          <TalentForm
            talent={talent}
            onSave={handleSave}
            onCancel={handleCancel}
            onDelete={talent ? handleDelete : undefined}
          />
        )}
      </div>
    </div>
  );
};

export default TalentFormPresenter;
