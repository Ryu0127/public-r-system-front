import React from 'react';

interface SearchKeywordInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export const SearchKeywordInput: React.FC<SearchKeywordInputProps> = ({
  value,
  onChange,
  onSearch,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <section className="max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
        <label htmlFor="search-keyword" className="block text-sm font-semibold text-gray-700 mb-3">
          検索キーワード
        </label>
        <div className="relative">
          <input
            id="search-keyword"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="例: ホロライブ、配信、歌ってみた..."
            className="w-full px-4 py-3 pr-10 bg-white border-2 border-gray-200 focus:border-[#1DA1F2] focus:outline-none rounded-xl text-gray-800 transition-all duration-200"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          検索したいキーワードを入力してください（複数のワードを入れる場合はスペースで区切ってください）
        </p>
      </div>
    </section>
  );
};
