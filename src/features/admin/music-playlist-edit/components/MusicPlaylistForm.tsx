import React, { useEffect, useMemo, useState } from 'react';
import { AdminMusicPlaylist, MusicPlaylistFormData } from '../types';
import {
  buildYoutubePlaylistEmbedUrl,
  buildYoutubePlaylistUrl,
  extractYoutubePlaylistCode,
} from '../utils/youtubePlaylistCode';

interface MusicPlaylistFormProps {
  playlist?: AdminMusicPlaylist;
  saving: boolean;
  onSave: (data: MusicPlaylistFormData) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

interface FormState {
  name: string;
  playlistInput: string;
  isVisible: boolean;
}

type FormErrors = Partial<Record<'name' | 'playlistInput', string>>;

const toFormState = (playlist?: AdminMusicPlaylist): FormState => ({
  name: playlist?.name ?? '',
  playlistInput: playlist?.youtubePlaylistCode ?? '',
  isVisible: playlist?.isVisible ?? true,
});

const validate = (form: FormState, playlistCode: string | null): FormErrors => {
  const errors: FormErrors = {};
  if (!form.name.trim()) {
    errors.name = 'プレイリスト名を入力してください';
  } else if (form.name.trim().length > 255) {
    errors.name = 'プレイリスト名は255文字以内で入力してください';
  }
  if (!form.playlistInput.trim()) {
    errors.playlistInput = 'YouTubeプレイリストIDまたはURLを入力してください';
  } else if (!playlistCode) {
    errors.playlistInput = 'プレイリストIDを読み取れません。プレイリストのURL（…/playlist?list=…）かIDを入力してください';
  }
  return errors;
};

const MusicPlaylistForm: React.FC<MusicPlaylistFormProps> = ({
  playlist,
  saving,
  onSave,
  onCancel,
  onDelete,
}) => {
  const [form, setForm] = useState<FormState>(() => toFormState(playlist));
  const [errors, setErrors] = useState<FormErrors>({});

  // 編集対象が後から読み込まれた場合にフォームへ反映
  useEffect(() => {
    setForm(toFormState(playlist));
    setErrors({});
  }, [playlist]);

  const playlistCode = useMemo(() => extractYoutubePlaylistCode(form.playlistInput), [form.playlistInput]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(form, playlistCode);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !playlistCode) return;

    onSave({
      youtubePlaylistCode: playlistCode,
      name: form.name.trim(),
      isVisible: form.isVisible,
    });
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-3 py-2 border rounded ${hasError ? 'border-red-400 bg-red-50' : ''}`;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 rounded shadow" noValidate>
      <h2 className="text-2xl font-bold mb-6">{playlist ? 'プレイリスト編集' : 'プレイリスト新規登録'}</h2>

      <div className="space-y-5">
        {/* プレイリスト名 */}
        <div>
          <label htmlFor="playlist-name" className="block text-sm font-medium mb-1">
            プレイリスト名<span className="text-red-500">*</span>
          </label>
          <input
            id="playlist-name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={inputClass(!!errors.name)}
            placeholder="例: おすすめ楽曲プレイリスト"
            maxLength={255}
          />
          <p className="text-xs text-gray-500 mt-1">楽曲一覧画面のプレイリストカード中央に表示されます</p>
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
        </div>

        {/* プレイリストID / URL */}
        <div>
          <label htmlFor="playlist-code" className="block text-sm font-medium mb-1">
            YouTubeプレイリストID または URL<span className="text-red-500">*</span>
          </label>
          <input
            id="playlist-code"
            type="text"
            name="playlistInput"
            value={form.playlistInput}
            onChange={handleChange}
            className={`${inputClass(!!errors.playlistInput)} font-mono text-sm`}
            placeholder="例: https://www.youtube.com/playlist?list=PLxxxxxxxx"
          />
          <p className="text-xs text-gray-500 mt-1">
            プレイリストのURLを貼り付けると、IDを自動で取り出します（https://www.youtube.com/playlist?list=<strong>プレイリストID</strong>）
          </p>
          {playlistCode && (
            <p className="text-sm text-gray-700 mt-1">
              登録されるID: <span className="font-mono font-semibold">{playlistCode}</span>
              <a
                href={buildYoutubePlaylistUrl(playlistCode)}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 text-blue-600 hover:underline"
              >
                YouTubeで確認
              </a>
            </p>
          )}
          {errors.playlistInput && <p className="text-sm text-red-600 mt-1">{errors.playlistInput}</p>}
        </div>

        {/* プレビュー */}
        {playlistCode && (
          <div>
            <span className="block text-sm font-medium mb-1">YouTubeプレビュー</span>
            <div className="aspect-video w-full max-w-lg">
              <iframe
                src={buildYoutubePlaylistEmbedUrl(playlistCode)}
                title="YouTubeプレイリストのプレビュー"
                className="w-full h-full rounded"
                allow="encrypted-media; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              非公開のプレイリストは表示されません（公開または限定公開にしてください）
            </p>
          </div>
        )}

        {/* 表示設定 */}
        <div>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isVisible"
              checked={form.isVisible}
              onChange={handleChange}
              className="rounded"
            />
            <span className="text-sm font-medium">楽曲一覧画面に表示する</span>
          </label>
          <p className="text-xs text-gray-500 mt-1">チェックを外すと、削除せずに一時的に非表示にできます</p>
        </div>

        {/* アクションボタン */}
        <div className="flex justify-between pt-4 border-t">
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? '保存中...' : playlist ? '更新' : '登録'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              キャンセル
            </button>
          </div>
          {playlist && onDelete && (
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                if (window.confirm(`「${playlist.name}」を削除しますか？この操作は取り消せません。`)) {
                  onDelete();
                }
              }}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              削除
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default MusicPlaylistForm;
