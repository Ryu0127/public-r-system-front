import React from 'react';
import MusicAdminPresenter from '../presenters/MusicAdminPresenter';
import { useMusicList } from '../hooks/useMusicList';

const MusicAdminContainer: React.FC = () => {
  const {
    musicList,
    loading,
    error,
  } = useMusicList();

  return (
    <MusicAdminPresenter
      musicList={musicList}
      loading={loading}
      error={error}
    />
  );
};

export default MusicAdminContainer;
