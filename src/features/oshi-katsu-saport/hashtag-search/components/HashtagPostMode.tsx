import React from 'react';
import { TalentHashtagsApiHashtag, TalentHashtagsApiEventHashtag } from 'hooks/api/oshi-katsu-saport/useTalentHashtagsGetApi';
import { Talent } from '../hooks/useHashtagSearchState';
import { HashIcon, getHashtagIcon } from './Icons';

interface HashtagPostModeProps {
  selectedTalent: Talent | null;
  hashtags: TalentHashtagsApiHashtag[];
  selectedTags: string[];
  selectedEventHashtags: TalentHashtagsApiEventHashtag[];
  includeEventUrl: boolean;
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
  onIncludeEventUrlChange: (include: boolean) => void;
  onPostToTwitter: () => void;
}

export const HashtagPostMode: React.FC<HashtagPostModeProps> = ({
  selectedTalent,
  hashtags,
  selectedTags,
  selectedEventHashtags,
  includeEventUrl,
  onToggleTag,
  onClearTags,
  onIncludeEventUrlChange,
  onPostToTwitter,
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

      {/* 選択中のハッシュタグ表示 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">
            選択中のハッシュタグ
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onClearTags}
              disabled={selectedTags.length === 0}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 border ${
                selectedTags.length > 0
                  ? 'text-gray-600 hover:text-red-600 bg-gray-100 hover:bg-red-50 border-gray-200 hover:border-red-300 cursor-pointer'
                  : 'text-gray-400 bg-gray-50 border-gray-100 cursor-not-allowed'
              }`}
            >
              クリア
            </button>
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1DA1F2] text-white text-sm font-bold shadow-md">
              {selectedTags.length}
            </span>
          </div>
        </div>
        <div className="min-h-[80px] p-4 bg-gray-50 rounded-xl border border-gray-200">
          {selectedTags.length > 0 ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#1DA1F2] text-white text-sm rounded-full shadow-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              {selectedEventHashtags.length > 0 && (
                <div className="pt-2 border-t border-gray-300 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={includeEventUrl}
                      onChange={(e) => onIncludeEventUrlChange(e.target.checked)}
                      className="w-4 h-4 text-[#1DA1F2] bg-white border-gray-300 rounded focus:ring-[#1DA1F2] focus:ring-2 cursor-pointer"
                    />
                    <span className="text-xs text-gray-700 font-semibold group-hover:text-[#1DA1F2] transition-colors">
                      イベントURLを投稿に含める
                    </span>
                  </label>
                  {includeEventUrl && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1 font-semibold">イベントURL:</p>
                      {selectedEventHashtags.map((event, index) => (
                        <div key={index} className="text-xs text-blue-600 break-all">
                          {event.url}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-4">
              ハッシュタグを選択してください
            </p>
          )}
        </div>
      </div>

      {/* 投稿ボタン */}
      <div>
        <button
          onClick={onPostToTwitter}
          disabled={selectedTags.length === 0}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            selectedTags.length > 0
              ? 'bg-gradient-to-r from-[#1DA1F2] to-[#0d8bd9] hover:from-[#0d8bd9] hover:to-[#1DA1F2] text-white shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <HashIcon />
          Xで投稿する
        </button>
        <p className="text-xs text-gray-500 text-center mt-3">
          ※ ボタンを押下すると、新しいタブでXの投稿画面が開きます
          {selectedEventHashtags.length > 0 && includeEventUrl && (
            <><br />※ イベントURLが投稿に含まれます</>
          )}
        </p>
      </div>
    </div>
  );
};
