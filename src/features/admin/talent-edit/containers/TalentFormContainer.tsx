import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TalentFormPresenter from '../presenters/TalentFormPresenter';
import { useTalentEdit } from '../hooks/useTalentEdit';
import { AdminTalent } from '../types';

const TalentFormContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    talents,
    loading,
    error,
    createTalent,
    updateTalent,
    deleteTalent,
    getTalentById,
  } = useTalentEdit();

  const [talent, setTalent] = useState<AdminTalent | undefined>(undefined);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id && !loading) {
      // 編集モード: IDからタレントを取得（loading完了後）
      const foundTalent = getTalentById(id);
      if (foundTalent) {
        setTalent(foundTalent);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    }
  }, [id, loading, getTalentById, talents]);

  const handleSave = async (talentData: Partial<AdminTalent>) => {
    if (id) {
      // 編集モード
      return await updateTalent(id, talentData);
    } else {
      // 新規作成モード
      return await createTalent(talentData);
    }
  };

  const handleDelete = async () => {
    if (id) {
      return await deleteTalent(id);
    }
    return false;
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            指定されたタレントが見つかりませんでした
          </div>
        </div>
      </div>
    );
  }

  return (
    <TalentFormPresenter
      talent={talent}
      loading={loading}
      error={error}
      onSave={handleSave}
      onDelete={id ? handleDelete : undefined}
    />
  );
};

export default TalentFormContainer;
