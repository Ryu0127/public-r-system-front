import React, { useRef, useEffect } from 'react';
import { Talent } from '../types';

interface BaseTalentSelectorProps {
  talents: Talent[];
  selectedTalent: Talent | null;
  searchQuery: string;
  isDropdownOpen: boolean;
  onSearchQueryChange: (query: string) => void;
  onTalentSelect: (talent: Talent) => void;
  onDropdownOpenChange: (isOpen: boolean) => void;
}

export const BaseTalentSelector: React.FC<BaseTalentSelectorProps> = ({
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
    <div className="mb-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-gray-200 shadow-md overflow-visible">
        <label htmlFor="base-talent-combobox" className="block text-sm font-semibold text-gray-700 mb-3">
          メインタレントを選択
        </label>
        <div className="relative" ref={comboboxRef}>
          <input
            id="base-talent-combobox"
            type="text"
            value={isDropdownOpen ? searchQuery : selectedTalent?.talentNameJoin || ''}
            onChange={(e) => {
              onSearchQueryChange(e.target.value);
              onDropdownOpenChange(true);
            }}
            onFocus={() => onDropdownOpenChange(true)}
            placeholder="タレント名を入力して検索..."
            className="w-full px-4 py-3 pr-10 bg-white border-2 border-gray-200 focus:border-blue-500 focus:outline-none rounded-lg text-gray-800 transition-all duration-200"
          />
          {/* 検索アイコン */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* ドロップダウンリスト */}
          {isDropdownOpen && filteredTalents.length > 0 && (
            <div className="absolute z-[9999] w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {filteredTalents.slice(0, 10).map((talent) => (
                <div
                  key={talent.id}
                  onClick={() => onTalentSelect(talent)}
                  className={`px-4 py-3 cursor-pointer transition-all duration-200 ${
                    talent.id === selectedTalent?.id
                      ? 'bg-blue-500 text-white'
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
            <div className="absolute z-[9999] w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl p-4 text-center text-gray-500">
              該当するタレントが見つかりません
            </div>
          )}
        </div>
        {selectedTalent && (
          <p className="text-xs text-gray-500 mt-2">
            選択中: <span className="font-semibold text-blue-600">{selectedTalent.talentNameJoin}</span>
          </p>
        )}
      </div>
    </div>
  );
};
