import React, { useRef, useEffect } from 'react';
import { Talent } from '../hooks/useHashtagSearchState';

interface TalentSelectorProps {
  talents: Talent[];
  selectedTalent: Talent | null;
  searchQuery: string;
  isDropdownOpen: boolean;
  onSearchQueryChange: (query: string) => void;
  onTalentSelect: (talent: Talent) => void;
  onDropdownOpenChange: (isOpen: boolean) => void;
}

export const TalentSelector: React.FC<TalentSelectorProps> = ({
  talents,
  selectedTalent,
  searchQuery,
  isDropdownOpen,
  onSearchQueryChange,
  onTalentSelect,
  onDropdownOpenChange,
}) => {
  const comboboxRef = useRef<HTMLDivElement>(null);

  // フィルタリングされたタレントリスト
  const filteredTalents = talents.filter((talent) =>
    talent.talentNameJoin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 外側クリックでドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        onDropdownOpenChange(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onDropdownOpenChange]);

  return (
    <section className="max-w-2xl mx-auto mb-8 animate-fade-in overflow-visible relative z-[10000]" style={{ animationDelay: '0.2s' }}>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg overflow-visible">
        <label htmlFor="talent-combobox" className="block text-sm font-semibold text-gray-700 mb-3">
          タレントを選択
        </label>
        <div className="relative" ref={comboboxRef}>
          <input
            id="talent-combobox"
            type="text"
            value={isDropdownOpen ? searchQuery : selectedTalent?.talentNameJoin || ''}
            onChange={(e) => {
              onSearchQueryChange(e.target.value);
              onDropdownOpenChange(true);
            }}
            onFocus={() => onDropdownOpenChange(true)}
            placeholder="タレント名を入力して検索..."
            className="w-full px-4 py-3 pr-10 bg-white border-2 border-gray-200 focus:border-[#1DA1F2] focus:outline-none rounded-xl text-gray-800 transition-all duration-200"
          />
          {/* 検索アイコン */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* ドロップダウンリスト */}
          {isDropdownOpen && filteredTalents.length > 0 && (
            <div className="absolute z-[9999] w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
              {filteredTalents.slice(0, 10).map((talent) => (
                <div
                  key={talent.id}
                  onClick={() => onTalentSelect(talent)}
                  className={`px-4 py-3 cursor-pointer transition-all duration-200 ${
                    talent.id === selectedTalent?.id
                      ? 'bg-[#1DA1F2] text-white'
                      : 'hover:bg-blue-50 text-gray-700'
                  }`}
                >
                  {talent.talentNameJoin}
                </div>
              ))}
            </div>
          )}

          {/* 結果が見つからない場合 */}
          {isDropdownOpen && searchQuery && filteredTalents.length === 0 && (
            <div className="absolute z-[9999] w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl p-4 text-center text-gray-500">
              該当するタレントが見つかりません
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          選択中: <span className="font-semibold text-[#1DA1F2]">{selectedTalent?.talentNameJoin || '未選択'}</span>
        </p>
      </div>
    </section>
  );
};
