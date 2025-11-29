import React from 'react';
import { TalentHashtagsApiEventHashtag } from 'hooks/api/oshi-katsu-saport/useTalentHashtagsGetApi';

interface SelectedTagsDisplayProps {
  selectedTags: string[];
  selectedEventHashtags: TalentHashtagsApiEventHashtag[];
  includeEventUrl: boolean;
  onClearTags: () => void;
  onIncludeEventUrlChange: (include: boolean) => void;
}

export const SelectedTagsDisplay: React.FC<SelectedTagsDisplayProps> = ({
  selectedTags,
  selectedEventHashtags,
  includeEventUrl,
  onClearTags,
  onIncludeEventUrlChange,
}) => {
  return (
    <div className="mb-4">
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
  );
};
