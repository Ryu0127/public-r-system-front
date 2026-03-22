import React from 'react';

interface EmptyStateProps {
  hasSelectedTalent: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ hasSelectedTalent }) => {
  if (!hasSelectedTalent) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
          <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">タレントを選択してください</p>
        <p className="text-gray-400 text-sm mt-1">上のフォームからタレントを選ぶと楽曲一覧が表示されます</p>
      </div>
    );
  }

  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      </div>
      <p className="text-gray-500 font-medium">楽曲が見つかりませんでした</p>
      <p className="text-gray-400 text-sm mt-1">このタレントの楽曲データはまだ登録されていません</p>
    </div>
  );
};
