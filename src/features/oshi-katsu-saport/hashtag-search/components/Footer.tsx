import React from 'react';

const APP_TITLE = 'タレント別 ハッシュタグ投稿/検索 サポート';

export const Footer: React.FC = () => {
  return (
    <footer className="text-center pt-16 mt-16 border-t border-gray-200 animate-fade-in" style={{ animationDelay: '0.5s' }}>
      <p className="text-gray-500 text-sm font-light tracking-wide">
        © 2025 {APP_TITLE}. All rights reserved.
      </p>
      <p className="text-gray-400 text-xs mt-2 italic">
        Built with React + Tailwind CSS
      </p>
    </footer>
  );
};
