import React from 'react';
import { TalentHashtagsApiEventHashtag } from 'hooks/api/oshi-katsu-saport/useTalentHashtagsGetApi';
import { ExternalLinkIcon, getHashtagIcon } from './Icons';

interface EventHashtagsSectionProps {
  eventHashtags: TalentHashtagsApiEventHashtag[];
  selectedTags: string[];
  mode: 'post' | 'search';
  includeEventUrl: boolean;
  onEventHashtagToggle: (eventHashtag: TalentHashtagsApiEventHashtag) => void;
  onSearchQueryChange: (query: string) => void;
  onIncludeEventUrlChange: (include: boolean) => void;
}

export const EventHashtagsSection: React.FC<EventHashtagsSectionProps> = ({
  eventHashtags,
  selectedTags,
  mode,
  includeEventUrl,
  onEventHashtagToggle,
  onSearchQueryChange,
  onIncludeEventUrlChange,
}) => {
  if (eventHashtags.length === 0) {
    return null;
  }

  return (
    <section className="max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.25s' }}>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#1DA1F2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          イベントハッシュタグ
        </h2>
        <div className="space-y-4">
          {eventHashtags.map((event) => {
            const isSelected = selectedTags.includes(event.tag);

            return (
              <div
                key={event.id}
                className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-4 border-2 border-blue-200 hover:border-[#1DA1F2] transition-all duration-300 hover:shadow-lg"
              >
                <div className="space-y-3">
                  {/* イベント名 */}
                  <h3 className="text-lg font-bold text-gray-800">
                    {event.eventName}
                  </h3>

                  {/* ハッシュタグボタン（通常のハッシュタグと同じスタイル） */}
                  {mode === 'post' ? (
                    <label
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'bg-[#1DA1F2] border-[#1DA1F2] text-white shadow-lg shadow-blue-500/30'
                          : 'bg-white border-gray-200 hover:border-[#1DA1F2] text-gray-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onEventHashtagToggle(event)}
                        className="hidden"
                      />
                      <div className={`flex-shrink-0 ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                        {getHashtagIcon('イベント')}
                      </div>
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <span className="text-sm font-medium truncate">#{event.tag}</span>
                        <span className={`text-xs ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                          イベントカテゴリー：{event.type}
                        </span>
                      </div>
                    </label>
                  ) : (
                    <button
                      onClick={() => onSearchQueryChange(event.tag)}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-white border-2 border-gray-200 hover:border-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 group"
                    >
                      <div className="flex-shrink-0 text-gray-500 group-hover:text-white">
                        {getHashtagIcon('イベント')}
                      </div>
                      <div className="flex flex-col gap-1 flex-1 min-w-0 text-left">
                        <span className="text-sm font-medium text-gray-700 group-hover:text-white truncate">#{event.tag}</span>
                        <span className="text-xs text-gray-500 group-hover:text-blue-100">
                          イベントカテゴリー：{event.type}
                        </span>
                      </div>
                    </button>
                  )}

                  {/* イベントURL投稿オプション（投稿モードのみ） */}
                  {mode === 'post' && isSelected && (
                    <div className="p-3 bg-white/80 rounded-lg border border-blue-200">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={includeEventUrl}
                          onChange={(e) => onIncludeEventUrlChange(e.target.checked)}
                          className="w-4 h-4 text-[#1DA1F2] bg-white border-gray-300 rounded focus:ring-[#1DA1F2] focus:ring-2 cursor-pointer"
                        />
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-[#1DA1F2] transition-colors">
                          イベントURLを投稿に含める
                        </span>
                      </label>
                      {includeEventUrl && (
                        <div className="mt-2 ml-6">
                          <p className="text-xs text-gray-600 mb-1 font-semibold">投稿に含まれるURL:</p>
                          <div className="text-xs text-blue-600 break-all">
                            {event.url}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* イベント詳細を見るボタン */}
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DA1F2] to-[#0d8bd9] hover:from-[#0d8bd9] hover:to-[#1DA1F2] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <ExternalLinkIcon />
                    イベント詳細を見る
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
