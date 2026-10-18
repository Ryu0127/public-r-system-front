import React, { useEffect, useMemo, useState } from 'react';
import { PlaylistMusicItem } from '../../music-playlist-edit/types';
import { PLAYLIST_MUSIC_TALENT_MAX_COUNT } from '../hooks/useMusicPlaylistMusic';

interface PlaylistMusicTalentModalProps {
  /** 編集対象の楽曲（null の場合は非表示） */
  item: PlaylistMusicItem | null;
  /** タレントID → タレント名（タレント一覧の並び順） */
  talentNameMap: Record<number, string>;
  onApply: (musicId: number, talentIds: number[]) => void;
  onClose: () => void;
}

/**
 * プレイリストに紐付けた楽曲のタレントを選択するモーダル
 */
const PlaylistMusicTalentModal: React.FC<PlaylistMusicTalentModalProps> = ({
  item,
  talentNameMap,
  onApply,
  onClose,
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [query, setQuery] = useState('');
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  // 開くたびに対象楽曲の現在のタレントで初期化
  useEffect(() => {
    if (!item) return;
    setSelectedIds(item.talentIds);
    setQuery('');
    setShowSelectedOnly(false);
  }, [item]);

  // Escape キーで閉じる
  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  const talents = useMemo(
    () => Object.keys(talentNameMap).map(Number).map((id) => ({ id, name: talentNameMap[id] })),
    [talentNameMap]
  );

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const isMaxReached = selectedIds.length >= PLAYLIST_MUSIC_TALENT_MAX_COUNT;

  const visibleTalents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return talents
      .filter((t) => !showSelectedOnly || selectedSet.has(t.id))
      .filter((t) => !q || t.name.toLowerCase().includes(q) || String(t.id) === q);
  }, [talents, query, showSelectedOnly, selectedSet]);

  if (!item) return null;

  const toggle = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((v) => v !== id);
      if (prev.length >= PLAYLIST_MUSIC_TALENT_MAX_COUNT) return prev;
      return prev.concat(id);
    });
  };

  const musicTalentNames = item.musicTalentIds.map((id) => talentNameMap[id] ?? `ID:${id}`);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="playlist-music-talent-modal-title"
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b">
          <h2 id="playlist-music-talent-modal-title" className="text-lg font-bold">
            タレントの紐付け
          </h2>
          <p className="mt-1 text-sm text-gray-700 truncate" title={item.title}>
            {item.title}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            楽曲管理でのタレント: {musicTalentNames.length > 0 ? musicTalentNames.join('、') : '未設定'}
          </p>
        </div>

        {talents.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-gray-500">
            タレント一覧を取得できませんでした。画面を再読み込みしてください。
          </div>
        ) : (
          <>
            <div className="px-5 py-3 border-b space-y-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="タレント名またはタレントIDで検索"
                className="w-full px-3 py-2 border rounded text-sm"
                autoFocus
              />
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <label className="inline-flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showSelectedOnly}
                    onChange={(e) => setShowSelectedOnly(e.target.checked)}
                    className="rounded"
                  />
                  選択中のみ表示
                </label>
                <button
                  type="button"
                  onClick={() => setSelectedIds(item.musicTalentIds.slice(0, PLAYLIST_MUSIC_TALENT_MAX_COUNT))}
                  disabled={item.musicTalentIds.length === 0}
                  className="px-2 py-1 border rounded text-xs hover:bg-gray-50 disabled:opacity-40"
                >
                  楽曲のタレントを反映
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  disabled={selectedIds.length === 0}
                  className="px-2 py-1 border rounded text-xs hover:bg-gray-50 disabled:opacity-40"
                >
                  すべて解除
                </button>
                <span className="ml-auto text-xs text-gray-500">
                  選択中: {selectedIds.length}名（最大{PLAYLIST_MUSIC_TALENT_MAX_COUNT}名）
                </span>
              </div>
            </div>

            <div className="px-5 py-3 overflow-y-auto flex-1">
              {visibleTalents.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-500">該当するタレントがいません</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {visibleTalents.map((t) => {
                    const isSelected = selectedSet.has(t.id);
                    return (
                      <label
                        key={t.id}
                        className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-200 hover:bg-gray-50'
                        } ${!isSelected && isMaxReached ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggle(t.id)}
                          disabled={!isSelected && isMaxReached}
                          className="rounded"
                        />
                        <span className="text-sm truncate" title={t.name}>
                          {t.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        <div className="px-5 py-3 border-t flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
            キャンセル
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(item.musicId, selectedIds);
              onClose();
            }}
            disabled={talents.length === 0}
            className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            決定
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistMusicTalentModal;
