import React from 'react';
import { TalentHashtagsApiHashtag } from 'hooks/api/oshi-katsu-saport/useTalentHashtagsGetApi';
import { Talent } from '../hooks/useHashtagSearchState';
import { getHashtagIcon } from './Icons';

interface HashtagPostModeProps {
  selectedTalent: Talent | null;
  hashtags: TalentHashtagsApiHashtag[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}

export const HashtagPostMode: React.FC<HashtagPostModeProps> = ({
  selectedTalent,
  hashtags,
  selectedTags,
  onToggleTag,
}) => {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.25s' }}>
      {/* カードヘッダー */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1DA1F2] to-[#0d8bd9] text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
            <HashIcon />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              ハッシュタグ投稿
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {selectedTalent?.talentNameJoin || '未選択'}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          複数のハッシュタグを選択してXに投稿できます
        </p>
      </div>

      {/* ハッシュタグ選択エリア */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          投稿するハッシュタグを選択
        </h3>
        <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2">
          {hashtags.map((hashtag) => (
            <label
              key={hashtag.id}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedTags.includes(hashtag.tag)
                  ? 'bg-[#1DA1F2] border-[#1DA1F2] text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white border-gray-200 hover:border-[#1DA1F2] text-gray-700'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedTags.includes(hashtag.tag)}
                onChange={() => onToggleTag(hashtag.tag)}
                className="hidden"
              />
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className={`flex-shrink-0 ${selectedTags.includes(hashtag.tag) ? 'text-white' : 'text-gray-500'}`}>
                  {getHashtagIcon(hashtag.description)}
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <span className="text-sm font-medium truncate">#{hashtag.tag}</span>
                  <span className={`text-xs ${selectedTags.includes(hashtag.tag) ? 'text-blue-100' : 'text-gray-500'}`}>
                    {hashtag.description}
                  </span>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
