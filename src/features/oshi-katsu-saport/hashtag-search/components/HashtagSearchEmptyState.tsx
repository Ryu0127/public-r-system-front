import React from 'react';

interface HashtagSearchEmptyStateProps {
}

export const HashtagSearchEmptyState: React.FC<HashtagSearchEmptyStateProps> = () => {
  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      </div>
      <p className="text-gray-500 font-medium">タレントを選択してください</p>
      <p className="text-gray-400 text-sm mt-1">上のフォームからタレントを選ぶと登録済みハッシュタグが表示されます</p>
    </div>
  );
};
