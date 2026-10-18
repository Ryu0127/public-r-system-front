import React from 'react';
import { PlaylistMusicItem } from '../../music-playlist-edit/types';
import { MUSIC_TYPE_LABELS } from '../../talent-music-edit/types';
import MusicThumb from './MusicThumb';

interface PlaylistMusicListProps {
  items: PlaylistMusicItem[];
  /** タレントID → タレント名 */
  talentNameMap: Record<number, string>;
  disabled: boolean;
  onMove: (index: number, to: number) => void;
  onRemove: (musicId: number) => void;
  onEditTalents: (musicId: number) => void;
}

const iconButtonClass =
  'w-7 h-7 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs';

/**
 * プレイリストに紐付けた楽曲（並び順の変更・解除・タレントの紐付け）
 */
const PlaylistMusicList: React.FC<PlaylistMusicListProps> = ({
  items,
  talentNameMap,
  disabled,
  onMove,
  onRemove,
  onEditTalents,
}) => {
  if (items.length === 0) {
    return (
      <div className="px-4 py-10 text-center text-sm text-gray-500">
        紐付けた楽曲はありません。右の楽曲一覧から「追加」してください。
      </div>
    );
  }

  const lastIndex = items.length - 1;

  return (
    <ol className="divide-y divide-gray-200">
      {items.map((item, index) => {
        const talentNames = item.talentIds.map((id) => talentNameMap[id] ?? `ID:${id}`);
        return (
          <li key={item.musicId} className="flex items-start gap-3 px-3 py-2">
            <span className="w-8 pt-2 text-right text-sm font-bold text-gray-500 flex-shrink-0">{index + 1}</span>
            <div className="pt-1">
              <MusicThumb youtubeVideoId={item.youtubeVideoId} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate" title={item.title}>
                {item.title}
              </p>
              <p className="text-xs text-gray-500">
                {MUSIC_TYPE_LABELS[item.type] ?? item.type}
                {item.releaseDate && ` ・ ${item.releaseDate}`}
                <span className="ml-2 text-gray-400">ID: {item.musicId}</span>
              </p>
              {/* タレント */}
              <div className="mt-1 flex flex-wrap items-center gap-1">
                {talentNames.length > 0 ? (
                  talentNames.map((name, i) => (
                    <span
                      key={`${item.talentIds[i]}`}
                      className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[11px] text-blue-700"
                    >
                      {name}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-gray-400">タレント未設定</span>
                )}
                <button
                  type="button"
                  onClick={() => onEditTalents(item.musicId)}
                  disabled={disabled}
                  className="ml-1 px-2 py-0.5 rounded border border-gray-300 text-[11px] text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  タレントを編集
                </button>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 pt-1">
              <button
                type="button"
                className={iconButtonClass}
                onClick={() => onMove(index, 0)}
                disabled={disabled || index === 0}
                aria-label={`${item.title}を先頭へ移動`}
                title="先頭へ"
              >
                ⤒
              </button>
              <button
                type="button"
                className={iconButtonClass}
                onClick={() => onMove(index, index - 1)}
                disabled={disabled || index === 0}
                aria-label={`${item.title}を1つ上へ移動`}
                title="上へ"
              >
                ▲
              </button>
              <button
                type="button"
                className={iconButtonClass}
                onClick={() => onMove(index, index + 1)}
                disabled={disabled || index === lastIndex}
                aria-label={`${item.title}を1つ下へ移動`}
                title="下へ"
              >
                ▼
              </button>
              <button
                type="button"
                className={iconButtonClass}
                onClick={() => onMove(index, lastIndex)}
                disabled={disabled || index === lastIndex}
                aria-label={`${item.title}を末尾へ移動`}
                title="末尾へ"
              >
                ⤓
              </button>
              <button
                type="button"
                onClick={() => onRemove(item.musicId)}
                disabled={disabled}
                className="ml-1 px-2 py-1 rounded bg-red-500 text-white text-xs hover:bg-red-600 disabled:opacity-50"
              >
                解除
              </button>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default PlaylistMusicList;
