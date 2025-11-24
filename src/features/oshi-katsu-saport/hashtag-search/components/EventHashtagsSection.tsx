import React from 'react';
import { TalentHashtagsApiEventHashtag } from 'hooks/api/oshi-katsu-saport/useTalentHashtagsGetApi';
import { ExternalLinkIcon } from './Icons';

interface EventHashtagsSectionProps {
  eventHashtags: TalentHashtagsApiEventHashtag[];
  selectedTags: string[];
  mode: 'post' | 'search';
  onEventHashtagToggle: (eventHashtag: TalentHashtagsApiEventHashtag) => void;
  onSearchQueryChange: (query: string) => void;
}

export const EventHashtagsSection: React.FC<EventHashtagsSectionProps> = ({
  eventHashtags,
  selectedTags,
  mode,
  onEventHashtagToggle,
  onSearchQueryChange,
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
          {eventHashtags.map((event) => (
            <div
              key={event.id}
              className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-4 border-2 border-blue-200 hover:border-[#1DA1F2] transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex flex-col gap-3">
                {/* イベント名 */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {event.eventName}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* ハッシュタグ（クリック可能） */}
                    <button
                      onClick={() => {
                        if (mode === 'post') {
                          onEventHashtagToggle(event);
                        } else {
                          onSearchQueryChange(event.tag);
                        }
                      }}
                      className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full shadow-md transition-all duration-200 hover:scale-105 ${
                        mode === 'post' && selectedTags.includes(event.tag)
                          ? 'bg-gradient-to-r from-[#1DA1F2] to-[#0d8bd9] text-white ring-2 ring-offset-2 ring-[#1DA1F2]'
                          : 'bg-[#1DA1F2] text-white hover:bg-[#0d8bd9]'
                      }`}
                    >
                      #{event.tag}
                      {mode === 'post' && selectedTags.includes(event.tag) && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    {/* 種類 */}
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white text-gray-700 text-xs font-medium rounded-full border border-gray-200">
                      イベントカテゴリー：{event.type}
                    </span>
                  </div>
                </div>
                {/* 外部リンクボタン */}
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
          ))}
        </div>
      </div>
    </section>
  );
};
