import React from 'react';
import TalentAdminPresenter from '../presenters/TalentAdminPresenter';
import { useTalentList } from '../hooks/useTalentList';

const TalentAdminContainer: React.FC = () => {
  const {
    talents,
    loading,
    error,
    deleteTalent,
  } = useTalentList();

  return (
    <TalentAdminPresenter
      talents={talents}
      loading={loading}
      error={error}
      onDelete={deleteTalent}
    />
  );
};

export default TalentAdminContainer;
