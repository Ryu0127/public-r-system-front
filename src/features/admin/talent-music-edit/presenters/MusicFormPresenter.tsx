import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminMusic, LAST_MUSIC_ACTION_FLASH_KEY, LastMusicAction } from '../types';
import MusicForm from '../components/MusicForm';
import Spinner from 'components/atoms/Spinner';
import { setNavigationFlash } from 'utils/navigationFlash';

const LIST_PATH = '/admin/talent-music';

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
  const router = useRouter();

  /** 完了メッセージを一覧画面へ渡して遷移する */
  const backToListWithMessage = (action: LastMusicAction) => {
    setNavigationFlash(LAST_MUSIC_ACTION_FLASH_KEY, action);
    router.push(LIST_PATH);
  };

  const handleSave = async (musicData: Partial<AdminMusic>) => {
    const id = await onSave(musicData);
    if (id != null) {
      backToListWithMessage({
        message: music ? '楽曲を更新しました' : '楽曲を登録しました',
        id,
      });
    }
  };

  const handleCancel = () => {
    router.push(LIST_PATH);
  };

  const handleDelete = async () => {
    if (onDelete) {
      const id = await onDelete();
      if (id != null) {
        backToListWithMessage({ message: '楽曲を削除しました', id });
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
          <Spinner sizeClass="h-8 w-8" borderClass="border-b-2 border-blue-500" className="inline-block" />
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
