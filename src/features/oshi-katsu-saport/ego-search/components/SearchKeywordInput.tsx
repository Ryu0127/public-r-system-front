import React from 'react';

interface SearchKeywordInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  onSearch: () => void;
}

export const SearchKeywordInput: React.FC<SearchKeywordInputProps> = ({
  values,
  onChange,
  onSearch,
}) => {
  const handleKeywordChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onChange(newValues);
  };

  const handleAddKeyword = () => {
    onChange([...values, '']);
  };

  const handleRemoveKeyword = (index: number) => {
    if (values.length === 1) {
      onChange(['']);
    } else {
      const newValues = values.filter((_, i) => i !== index);
      onChange(newValues);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <section className="max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-gray-700">
            検索キーワード（完全一致・OR検索）
          </label>
          <button
            type="button"
            onClick={handleAddKeyword}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white text-xs font-medium rounded-lg transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            追加
          </button>
        </div>

        <div className="space-y-2">
          {values.map((value, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  id={`search-keyword-${index}`}
                  type="text"
                  value={value}
                  onChange={(e) => handleKeywordChange(index, e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="例: ホロライブ"
                  className="w-full px-4 py-3 pr-10 bg-white border-2 border-gray-200 focus:border-[#1DA1F2] focus:outline-none rounded-xl text-gray-800 transition-all duration-200"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              {values.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(index)}
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200"
                  aria-label="キーワードを削除"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-3">
          各キーワードはダブルクォーテーションで囲まれ完全一致検索されます。複数のキーワードはOR検索になります。
        </p>
      </div>
    </section>
  );
};
