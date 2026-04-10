import React, { useRef, useEffect } from 'react';
import { MusicTalent } from '../types';

interface TalentSelectionModalProps {
  isOpen: boolean;
  talents: MusicTalent[];
  selectedTalent: MusicTalent | null;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onTalentSelect: (talent: MusicTalent) => void;
  onClose: () => void;
}

const AVATAR_COLORS = [
  'from-red-400 to-pink-500',
  'from-purple-400 to-indigo-500',
  'from-blue-400 to-cyan-500',
  'from-green-400 to-teal-500',
  'from-yellow-400 to-orange-500',
  'from-pink-400 to-rose-500',
  'from-indigo-400 to-violet-500',
  'from-teal-400 to-emerald-500',
  'from-orange-400 to-amber-500',
  'from-cyan-400 to-sky-500',
];

const getAvatarColor = (id: string): string => {
  const num = parseInt(id, 10);
  const idx = isNaN(num) ? 0 : num % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

export const TalentSelectionModal: React.FC<TalentSelectionModalProps> = ({
  isOpen,
  talents,
  selectedTalent,
  searchQuery,
  onSearchQueryChange,
  onTalentSelect,
  onClose,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredTalents = talents.filter((talent) =>
    talent.talentNameJoin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* ヘッダー */}
        <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">タレントを選択</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="閉じる"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 検索コンボボックス */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="タレント名を入力して絞り込み..."
              className="w-full px-4 py-2.5 pl-10 bg-gray-50 border border-gray-200 focus:border-red-400 focus:outline-none focus:bg-white rounded-xl text-gray-800 transition-all duration-200 text-sm"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* タレント一覧グリッド */}
        <div className="overflow-y-auto flex-1 p-6">
          {filteredTalents.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
              {filteredTalents.map((talent, index) => {
                const isSelected = talent.id === selectedTalent?.id;
                const avatarColor = getAvatarColor(talent.id);
                const initial = talent.talentName.charAt(0);

                return (
                  <button
                    key={`${talent.id}-${index}`}
                    onClick={() => onTalentSelect(talent)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 text-center group cursor-pointer
                      ${isSelected
                        ? 'bg-red-50 ring-2 ring-red-400'
                        : 'hover:bg-gray-50'
                      }`}
                  >
                    {/* アバター */}
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold text-2xl shadow-md group-hover:shadow-lg transition-shadow flex-shrink-0`}
                    >
                      {initial}
                    </div>

                    {/* 名前 */}
                    <div className="w-full">
                      <p className={`text-xs font-semibold leading-snug break-words ${isSelected ? 'text-red-600' : 'text-gray-800'}`}>
                        {talent.talentName}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-snug break-words">
                        {talent.talentNameEn}
                      </p>
                    </div>

                    {/* 選択中バッジ */}
                    {isSelected && (
                      <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-medium">
                        選択中
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <svg className="w-12 h-12 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-sm">該当するタレントが見つかりません</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
