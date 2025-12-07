import React, { useRef, useEffect } from 'react';
import { Collaborator } from '../types';

interface CollaboratorSelectorProps {
  collaborators: Collaborator[];
  selectedCollaborator: Collaborator | null;
  searchQuery: string;
  isDropdownOpen: boolean;
  isDisabled: boolean;
  onSearchQueryChange: (query: string) => void;
  onCollaboratorSelect: (collaborator: Collaborator) => void;
  onDropdownOpenChange: (isOpen: boolean) => void;
}

export const CollaboratorSelector: React.FC<CollaboratorSelectorProps> = ({
  collaborators,
  selectedCollaborator,
  searchQuery,
  isDropdownOpen,
  isDisabled,
  onSearchQueryChange,
  onCollaboratorSelect,
  onDropdownOpenChange,
}) => {
  const comboboxRef = useRef<HTMLDivElement>(null);

  // フィルタリングされたコラボレーターリスト
  const filteredCollaborators = collaborators.filter((collaborator) =>
    `${collaborator.talentName}${collaborator.talentNameEn}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
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

  const displayValue = isDropdownOpen
    ? searchQuery
    : selectedCollaborator
    ? `${selectedCollaborator.talentName}（${selectedCollaborator.talentNameEn}）`
    : '';

  return (
    <div className="mb-6">
      <div className={`bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-gray-200 shadow-md overflow-visible ${isDisabled ? 'opacity-50' : ''}`}>
        <label htmlFor="collaborator-combobox" className="block text-sm font-semibold text-gray-700 mb-3">
          コラボタレントを選択
        </label>
        <div className="relative" ref={comboboxRef}>
          <input
            id="collaborator-combobox"
            type="text"
            value={displayValue}
            onChange={(e) => {
              onSearchQueryChange(e.target.value);
              onDropdownOpenChange(true);
            }}
            onFocus={() => !isDisabled && onDropdownOpenChange(true)}
            placeholder={isDisabled ? 'まずメインタレントを選択してください' : 'コラボタレント名を入力...'}
            disabled={isDisabled}
            className="w-full px-4 py-3 pr-10 bg-white border-2 border-gray-200 focus:border-purple-500 focus:outline-none rounded-lg text-gray-800 transition-all duration-200 disabled:cursor-not-allowed disabled:bg-gray-100"
          />
          {/* 検索アイコン */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* ドロップダウンリスト */}
          {isDropdownOpen && !isDisabled && filteredCollaborators.length > 0 && (
            <div className="absolute z-[9999] w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {filteredCollaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  onClick={() => onCollaboratorSelect(collaborator)}
                  className={`px-4 py-3 cursor-pointer transition-all duration-200 ${
                    collaborator.id === selectedCollaborator?.id
                      ? 'bg-purple-500 text-white'
                      : 'hover:bg-purple-50 text-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>
                      {collaborator.talentName}（{collaborator.talentNameEn}）
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      collaborator.id === selectedCollaborator?.id
                        ? 'bg-white/20 text-white'
                        : 'bg-purple-100 text-purple-600'
                    }`}>
                      {collaborator.collaborationCount}回
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 結果が見つからない場合 */}
          {isDropdownOpen && !isDisabled && searchQuery && filteredCollaborators.length === 0 && (
            <div className="absolute z-[9999] w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl p-4 text-center text-gray-500">
              該当するコラボタレントが見つかりません
            </div>
          )}

          {/* コラボレーターがいない場合 */}
          {isDropdownOpen && !isDisabled && collaborators.length === 0 && (
            <div className="absolute z-[9999] w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl p-4 text-center text-gray-500">
              コラボ履歴がありません
            </div>
          )}
        </div>
        {selectedCollaborator && !isDisabled && (
          <p className="text-xs text-gray-500 mt-2">
            選択中: <span className="font-semibold text-purple-600">{selectedCollaborator.talentName}（{selectedCollaborator.talentNameEn}）</span>
            {' '}・ コラボ回数: <span className="font-semibold">{selectedCollaborator.collaborationCount}回</span>
          </p>
        )}
      </div>
    </div>
  );
};
