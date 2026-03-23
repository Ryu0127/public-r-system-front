import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MusicFormPresenter from '../presenters/MusicFormPresenter';
import { useMusicEdit } from '../hooks/useMusicEdit';
import { AdminMusic } from '../types';

const MusicFormContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    musicList,
    loading,
    error,
    createMusic,
    updateMusic,
    deleteMusic,
    fetchMusicById,
    getMusicById,
  } = useMusicEdit();

  const [music, setMusic] = useState<AdminMusic | undefined>(undefined);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    const foundMusic = getMusicById(id);
    if (foundMusic) {
      setMusic(foundMusic);
      setNotFound(false);
      return;
    }

    let cancelled = false;
    (async () => {
      const fetched = await fetchMusicById(id);
      if (cancelled) return;
      if (fetched) {
        setMusic(fetched);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, getMusicById, fetchMusicById, musicList]);

  const handleSave = async (
    musicData: Partial<AdminMusic>
  ): Promise<number | null> => {
    if (id) {
      return await updateMusic(id, musicData);
    } else {
      return await createMusic(musicData);
    }
  };

  const handleDelete = async (): Promise<number | null> => {
    if (id) {
      return await deleteMusic(id);
    }
    return null;
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            指定された楽曲が見つかりませんでした
          </div>
        </div>
      </div>
    );
  }

  return (
    <MusicFormPresenter
      music={music}
      loading={loading}
      error={error}
      onSave={handleSave}
      onDelete={id ? handleDelete : undefined}
    />
  );
};

export default MusicFormContainer;
