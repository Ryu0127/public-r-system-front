import React, { useMemo, useState } from 'react';
import { AdminMusic, MUSIC_TYPE_LABELS, MusicType } from '../../talent-music-edit/types';
import MusicThumb from './MusicThumb';

interface MusicCandidateListProps {
  allMusic: AdminMusic[];
  /** タレントID → タレント名（空の場合はタレント絞り込みを表示しない） */
  talentNameMap: Record<number, string>;
  linkedIdSet: Set<number>;
  disabled: boolean;
  isMaxReached: boolean;
  onAdd: (music: AdminMusic) => void;
}

const toTime = (date: string) => {
  const t = new Date(date).getTime();
  return Number.isNaN(t) ? 0 : t;
};

/**
 * 紐付け候補の楽曲一覧（検索・種別／タレントでの絞り込み・追加）
 */
const MusicCandidateList: React.FC<MusicCandidateListProps> = ({
  allMusic,
  talentNameMap,
  linkedIdSet,
  disabled,
  isMaxReached,
  onAdd,
}) => {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<MusicType | 'all'>('all');
  /** 絞り込むタレントID（'all' は指定なし） */
  const [talentFilter, setTalentFilter] = useState<number | 'all'>('all');
  const [hideLinked, setHideLinked] = useState(true);

  const getTalentNames = (talentIds: number[]): string[] =>
    (talentIds || []).map((id) => talentNameMap[id] ?? `ID:${id}`);

  /** 楽曲が1曲以上紐付いているタレントのみ（タレント一覧の並び順・曲数付き） */
  const talentOptions = useMemo(() => {
    const counts = new Map<number, number>();
    allMusic.forEach((m) => {
      new Set(m.talentIds || []).forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1));
    });
    return Object.keys(talentNameMap)
      .map(Number)
      .filter((id) => counts.has(id))
      .map((id) => ({ id, name: talentNameMap[id], count: counts.get(id) ?? 0 }));
  }, [allMusic, talentNameMap]);

  const candidates = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matchesQuery = (m: AdminMusic) => {
      if (!q) return true;
      if (m.title.toLowerCase().includes(q) || String(m.id) === q) return true;
      return (m.talentIds || []).some((id) => (talentNameMap[id] ?? '').toLowerCase().includes(q));
    };
    return allMusic
      .filter((m) => typeFilter === 'all' || m.type === typeFilter)
      .filter((m) => talentFilter === 'all' || (m.talentIds || []).includes(talentFilter))
      .filter(matchesQuery)
      .filter((m) => !hideLinked || !linkedIdSet.has(m.id))
      .sort((a, b) => toTime(b.releaseDate) - toTime(a.releaseDate) || b.id - a.id);
  }, [allMusic, query, typeFilter, talentFilter, hideLinked, linkedIdSet, talentNameMap]);

  return (
    <div>
      <div className="p-3 border-b border-gray-200 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="タイトル・タレント名・楽曲IDで検索"
            className="flex-1 px-3 py-2 border rounded text-sm"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as MusicType | 'all')}
            className="px-3 py-2 border rounded text-sm"
          >
            <option value="all">すべて</option>
            <option value="original">{MUSIC_TYPE_LABELS.original}</option>
            <option value="cover">{MUSIC_TYPE_LABELS.cover}</option>
          </select>
        </div>

        {talentOptions.length > 0 && (
          <div className="flex items-center gap-2">
            <label htmlFor="candidate-talent-filter" className="text-sm text-gray-600 whitespace-nowrap">
              タレント
            </label>
            <select
              id="candidate-talent-filter"
              value={talentFilter === 'all' ? 'all' : String(talentFilter)}
              onChange={(e) => setTalentFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="flex-1 px-3 py-2 border rounded text-sm"
            >
              <option value="all">すべてのタレント</option>
              {talentOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}（{t.count}曲）
                </option>
              ))}
            </select>
            {talentFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setTalentFilter('all')}
                className="px-2 py-2 text-xs text-blue-600 hover:underline whitespace-nowrap"
              >
                解除
              </button>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <label className="inline-flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={hideLinked}
              onChange={(e) => setHideLinked(e.target.checked)}
              className="rounded"
            />
            紐付け済みの楽曲を隠す
          </label>
          <span className="text-xs text-gray-500">{candidates.length}曲</span>
        </div>
      </div>

      {candidates.length === 0 ? (
        <div className="px-4 py-10 text-center text-sm text-gray-500">該当する楽曲がありません</div>
      ) : (
        <ul className="divide-y divide-gray-200 max-h-[60vh] overflow-y-auto">
          {candidates.map((music) => {
            const isLinked = linkedIdSet.has(music.id);
            const talentNames = getTalentNames(music.talentIds);
            return (
              <li key={music.id} className={`flex items-center gap-3 px-3 py-2 ${isLinked ? 'bg-gray-50' : ''}`}>
                <MusicThumb youtubeVideoId={music.youtubeVideoId} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate" title={music.title}>
                    {music.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {MUSIC_TYPE_LABELS[music.type] ?? music.type}
                    {music.releaseDate && ` ・ ${music.releaseDate}`}
                    <span className="ml-2 text-gray-400">ID: {music.id}</span>
                  </p>
                  {talentNames.length > 0 && (
                    <p className="text-xs text-gray-600 truncate" title={talentNames.join('、')}>
                      {talentNames.join('、')}
                    </p>
                  )}
                </div>
                {isLinked ? (
                  <span className="px-2 py-1 text-xs text-gray-500 flex-shrink-0">追加済み</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onAdd(music)}
                    disabled={disabled || isMaxReached}
                    className="px-3 py-1 rounded bg-blue-500 text-white text-xs hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    追加
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MusicCandidateList;
