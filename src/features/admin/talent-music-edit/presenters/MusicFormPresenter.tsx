import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminMusic } from '../types';
import MusicForm from '../components/MusicForm';

interface MusicFormPresenterProps {
  music?: AdminMusic;
  loading: boolean;
  error: string | null;
  onSave: (musicData: Partial<AdminMusic>) => Promise<number | null>;
  onDelete?: () => Promise<number | null>;
}

const MusicFormPresenter: React.FC<MusicFormPresenterProps> = ({
  music,
  loading,
  error,
  onSave,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleSave = async (musicData: Partial<AdminMusic>) => {
    const id = await onSave(musicData);
    if (id != null) {
      navigate('/admin/talent-music', {
        state: {
          lastMusicAction: {
            message: music ? '楽曲を更新しました' : '楽曲を登録しました',
            id,
          },
        },
      });
    }
  };

  const handleCancel = () => {
    navigate('/admin/talent-music');
  };

  const handleDelete = async () => {
    if (onDelete) {
      const id = await onDelete();
      if (id != null) {
        navigate('/admin/talent-music', {
          state: {
            lastMusicAction: {
              message: '楽曲を削除しました',
              id,
            },
          },
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {error && (
        <div className="max-w-4xl mx-auto mb-4">
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
        <MusicForm
          music={music}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={music ? handleDelete : undefined}
        />
      )}
    </div>
  );
};

export default MusicFormPresenter;
