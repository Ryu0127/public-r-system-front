import React from 'react';

export const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      </div>
      <p className="text-gray-500 font-medium">楽曲が見つかりませんでした</p>
      <p className="text-gray-400 text-sm mt-1">条件に一致する楽曲データはまだ登録されていません</p>
    </div>
  );
};
