import React from 'react';
import { MusicTalent } from '../types';

interface TalentSelectorProps {
  selectedTalent: MusicTalent | null;
  onOpenModal: () => void;
}

export const TalentSelector: React.FC<TalentSelectorProps> = ({
  selectedTalent,
  onOpenModal,
}) => {
  return (
    <section
      className="max-w-2xl mx-auto mb-8 animate-fade-in"
      style={{ animationDelay: '0.1s' }}
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          タレントを選択
        </label>

        <div className="flex items-center gap-3">
          {/* 選択中タレント表示エリア */}
          <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm truncate">
            {selectedTalent ? (
              <span className="font-medium text-gray-800">{selectedTalent.talentNameJoin}</span>
            ) : (
              <span className="text-gray-400">タレントを選択してください</span>
            )}
          </div>

          {/* モーダルを開くボタン */}
          <button
            onClick={onOpenModal}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-pink-700 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>タレント選択</span>
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          選択中:{' '}
          <span className="font-semibold text-red-500">
            {selectedTalent?.talentNameJoin || '未選択'}
          </span>
        </p>
      </div>
    </section>
  );
};
