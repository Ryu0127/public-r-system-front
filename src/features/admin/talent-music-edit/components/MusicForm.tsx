import React, { useState, useEffect } from 'react';
import { AdminMusic, MusicType, MUSIC_TYPE_LABELS } from '../types';
import { AdminTalent } from '../../talent-edit/types';
import { API_ENDPOINTS, getApiHeaders } from '../../../../config/api';

interface MusicFormProps {
  music?: AdminMusic;
  onSave: (musicData: Partial<AdminMusic>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const MusicForm: React.FC<MusicFormProps> = ({ music, onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState<Partial<AdminMusic>>({
    title: '',
    talentIds: [],
    youtubeVideoId: '',
    type: 'original',
    releaseDate: '',
    description: '',
    ...music,
  });

  const [talents, setTalents] = useState<AdminTalent[]>([]);
  const [talentsLoading, setTalentsLoading] = useState(false);
  const [youtubePreviewId, setYoutubePreviewId] = useState<string>(music?.youtubeVideoId || '');

  // タレント一覧を取得
  useEffect(() => {
    const fetchTalents = async () => {
      setTalentsLoading(true);
      try {
        const response = await fetch(API_ENDPOINTS.talents.list, {
          method: 'GET',
          headers: getApiHeaders(),
        });
        if (!response.ok) return;
        const apiResponse = await response.json();
        if (apiResponse.success) {
          setTalents(apiResponse.data);
        }
      } catch (err) {
        console.error('タレント取得エラー:', err);
      } finally {
        setTalentsLoading(false);
      }
    };
    fetchTalents();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'youtubeVideoId') {
      setYoutubePreviewId(value);
    }
  };

  const handleTalentToggle = (talentId: number) => {
    setFormData((prev) => {
      const currentIds = prev.talentIds || [];
      const isSelected = currentIds.includes(talentId);
      return {
        ...prev,
        talentIds: isSelected
          ? currentIds.filter((id) => id !== talentId)
          : [...currentIds, talentId],
      };
    });
  };

  const handleSubmit = () => {
    if (!formData.title?.trim()) {
      alert('タイトルを入力してください');
      return;
    }
    if (!formData.youtubeVideoId?.trim()) {
      alert('YouTube動画IDを入力してください');
      return;
    }
    if (!formData.releaseDate?.trim()) {
      alert('リリース日を入力してください');
      return;
    }
    if (!formData.talentIds || formData.talentIds.length === 0) {
      alert('タレントを1人以上選択してください');
      return;
    }

    const musicData: Partial<AdminMusic> = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    if (!music) {
      musicData.createdAt = new Date().toISOString();
    }

    onSave(musicData);
  };

  const musicTypes: { value: MusicType; label: string }[] = [
    { value: 'original', label: MUSIC_TYPE_LABELS.original },
    { value: 'cover', label: MUSIC_TYPE_LABELS.cover },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {music ? '楽曲編集' : '楽曲新規登録'}
        </h2>
      </div>

      <div className="space-y-4">
        {/* タイトル */}
        <div>
          <label className="block text-sm font-medium mb-1">
            タイトル<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="楽曲タイトルを入力"
            required
          />
        </div>

        {/* 種別 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            種別<span className="text-red-500">*</span>
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            {musicTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* リリース日 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            リリース日<span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        {/* YouTube動画ID */}
        <div>
          <label className="block text-sm font-medium mb-1">
            YouTube動画ID<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="youtubeVideoId"
            value={formData.youtubeVideoId}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="例: dQw4w9WgXcQ"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            YouTubeのURLから動画IDのみを入力してください（https://www.youtube.com/watch?v=<strong>動画ID</strong>）
          </p>
        </div>

        {/* YouTubeプレビュー */}
        {youtubePreviewId && (
          <div>
            <label className="block text-sm font-medium mb-1">YouTubeプレビュー</label>
            <div className="aspect-video w-full max-w-lg">
              <iframe
                src={`https://www.youtube.com/embed/${youtubePreviewId}`}
                title="YouTube preview"
                className="w-full h-full rounded"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* 対象タレント */}
        <div>
          <label className="block text-sm font-medium mb-1">
            対象タレント<span className="text-red-500">*</span>
          </label>
          {talentsLoading ? (
            <div className="text-sm text-gray-500 py-2">タレント読み込み中...</div>
          ) : talents.length === 0 ? (
            <div className="text-sm text-gray-500 py-2">タレントが見つかりません</div>
          ) : (
            <div className="border rounded p-3 max-h-60 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {talents.map((talent) => {
                  const talentId = Number(talent.id);
                  const isSelected = (formData.talentIds || []).includes(talentId);
                  return (
                    <label
                      key={talent.id}
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer border transition-colors ${
                        isSelected
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleTalentToggle(talentId)}
                        className="rounded"
                      />
                      <span className="text-sm">{talent.talentName}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
          {formData.talentIds && formData.talentIds.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              選択中: {formData.talentIds.length}名
            </p>
          )}
        </div>

        {/* 説明 */}
        <div>
          <label className="block text-sm font-medium mb-1">説明</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            rows={4}
            placeholder="楽曲の説明を入力（任意）"
          />
        </div>

        {/* アクションボタン */}
        <div className="flex justify-between pt-4 border-t">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {music ? '更新' : '登録'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              キャンセル
            </button>
          </div>
          {music && onDelete && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('本当に削除しますか？この操作は取り消せません。')) {
                  onDelete();
                }
              }}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              削除
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicForm;
